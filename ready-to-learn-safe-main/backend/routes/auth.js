const express = require('express');
const router = express.Router();

// Controllers
const {
  registerStudent,
  registerInstitution,
  loginStudent,
  loginInstitution,
  logout,
  getMe,
  refreshToken,
  changePassword,
  getProfile,
  updateProfile
} = require('../controllers/authController');

// Middleware
const { authenticate } = require('../middleware/auth');
const { authRateLimit, loginRateLimit } = require('../middleware/auth');
const {
  validateStudentRegistration,
  validateInstitutionRegistration,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate
} = require('../middleware/validation');

/**
 * @desc Authentication Routes
 * @route /api/auth
 */

// Student Registration
router.post('/student/register', 
  authRateLimit, 
  validateStudentRegistration, 
  registerStudent
);

// Institution Registration  
router.post('/institution/register', 
  authRateLimit, 
  validateInstitutionRegistration, 
  registerInstitution
);

// Student Login
router.post('/student/login', 
  loginRateLimit, 
  validateLogin, 
  loginStudent
);

// Institution Login
router.post('/institution/login', 
  loginRateLimit, 
  validateLogin, 
  loginInstitution
);

// Logout (any user type)
router.post('/logout', 
  authenticate, 
  logout
);

// Get current user info
router.get('/me', 
  authenticate, 
  getMe
);

// Refresh token (future feature)
router.post('/refresh', 
  refreshToken
);

// Change password
router.put('/change-password', 
  authenticate, 
  validatePasswordChange, 
  changePassword
);

// Get user profile
router.get('/profile', 
  authenticate, 
  getProfile
);

// Update user profile
router.put('/profile', 
  authenticate, 
  validateProfileUpdate, 
  updateProfile
);

module.exports = router;
