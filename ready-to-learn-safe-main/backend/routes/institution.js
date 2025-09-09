const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Institution = require("../models/Institution");
const Student = require('../models/Student');
const { authMiddleware, institutionOnly } = require('../middleware');

// Institution Registration
router.post('/institution/register', async (req, res) => {
    try {
        const { name, institutionId, email, password, phone, location } = req.body;

        const existingInstitution = await Institution.findOne({
            $or: [{ email }, { institutionId }]
        });
        if (existingInstitution) {
            return res.status(400).json({ message: "Institution with this email or ID already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const institution = new Institution({ name, institutionId, email, password: hashedPassword, phone, location });
        await institution.save();

        const token = jwt.sign({ _id: institution._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "Institution registered successfully",
            token,
            institution: { id: institution._id, name: institution.name, institutionId: institution.institutionId, email: institution.email }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Institution Login
router.post('/institution/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const institution = await Institution.findOne({ email });
        if (!institution) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, institution.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        const token = jwt.sign({ _id: institution._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            message: "Login successful",
            token,
            institution: { id: institution._id, name: institution.name, institutionId: institution.institutionId, email: institution.email }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Institution Profile
router.get('/institution/profile', authMiddleware, institutionOnly, async (req, res) => {
    try {
        res.json({
            institution: {
                id: req.user._id,
                name: req.user.name,
                institutionId: req.user.institutionId,
                email: req.user.email,
                phone: req.user.phone,
                location: req.user.location,
                isActive: req.user.isActive,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Institution Profile
router.put('/institution/profile', authMiddleware, institutionOnly, async (req, res) => {
    try {
        const { name, phone, location } = req.body;
        const updatedInstitution = await Institution.findByIdAndUpdate(
            req.user._id,
            { name, phone, location },
            { new: true, runValidators: true }
        );

        res.json({
            message: "Profile updated successfully",
            institution: updatedInstitution.toObject() // toObject() gives a plain JS object
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Institution Dashboard (with detailed student breakdown)
router.get('/institution/dashboard', authMiddleware, institutionOnly, async (req, res) => {
    try {
        const allStudents = await Student.find({ institutionId: req.user._id })
            .select('name rollNo class division year email phone');
            
        // Use 'reduce' to group students by class and then by division
        const studentsGrouped = allStudents.reduce((acc, student) => {
            const { class: studentClass, division } = student;
            
            // Group by class
            if (!acc[studentClass]) {
                acc[studentClass] = {
                    totalStudents: 0,
                    divisions: {}
                };
            }
            acc[studentClass].totalStudents++;
            
            // Group by division within the class
            if (!acc[studentClass].divisions[division]) {
                acc[studentClass].divisions[division] = [];
            }
            acc[studentClass].divisions[division].push(student);
            
            return acc;
        }, {});

        res.json({
            institution: {
                name: req.user.name,
                institutionId: req.user.institutionId,
                email: req.user.email,
                location: req.user.location
            },
            statistics: {
                totalStudents: allStudents.length,
                totalClasses: Object.keys(studentsGrouped).length
            },
            studentsByClassAndDivision: studentsGrouped,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});
module.exports = router;