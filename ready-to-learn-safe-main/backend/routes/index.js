const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');

/**
 * Main Routes Configuration
 * @desc Mount all route modules here
 */

// Authentication routes
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SafeEd API is running successfully',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SafeEd API',
    version: '1.0.0',
    documentation: {
      authentication: '/api/auth',
      health: '/api/health'
    },
    endpoints: {
      student: {
        register: 'POST /api/auth/student/register',
        login: 'POST /api/auth/student/login'
      },
      institution: {
        register: 'POST /api/auth/institution/register', 
        login: 'POST /api/auth/institution/login'
      },
      common: {
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me'
      }
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
