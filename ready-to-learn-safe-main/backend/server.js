const express = require('express');
const connectDb = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const institutionRouter = require('./routes/institution');
const studentRouter = require('./routes/student');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true
}));
app.use(express.json());

// Use routes
app.use('/api', institutionRouter);
app.use('/api', studentRouter);

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: "🚨 SafeEd API is running!",
        status: "success"
    });
});

// Connect to database and start server
connectDb()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 API URL: http://localhost:${PORT}/api`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
    });