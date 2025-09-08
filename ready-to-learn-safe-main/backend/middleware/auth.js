const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { sendUnauthorized, sendForbidden } = require('../utils/response');
const Student = require('../schema/Student');
const Institution = require('../schema/Institution');

/**
 * Authentication middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return sendUnauthorized(res, 'Access token is required');
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Find user based on type
    let user;
    if (decoded.type === 'student') {
      user = await Student.findById(decoded.id).populate('institutionId', 'name institutionId');
      if (!user || !user.isActive) {
        return sendUnauthorized(res, 'Student account not found or inactive');
      }
    } else if (decoded.type === 'institution') {
      user = await Institution.findById(decoded.id);
      if (!user || !user.isActive) {
        return sendUnauthorized(res, 'Institution account not found or inactive');
      }
    } else {
      return sendUnauthorized(res, 'Invalid token type');
    }
    
    // Check if account is locked
    if (user.isLocked) {
      return sendForbidden(res, 'Account is temporarily locked');
    }
    
    // Attach user info to request
    req.user = user;
    req.userType = decoded.type;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.message === 'Token expired') {
      return sendUnauthorized(res, 'Token has expired. Please login again.');
    }
    if (error.message === 'Invalid token') {
      return sendUnauthorized(res, 'Invalid access token');
    }
    
    console.error('Authentication error:', error);
    return sendUnauthorized(res, 'Authentication failed');
  }
};

/**
 * Authorization middleware to check user type
 * @param {Array|String} allowedTypes - Allowed user types ('student', 'institution')
 * @returns {Function} Middleware function
 */
const authorize = (allowedTypes) => {
  return (req, res, next) => {
    const types = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];
    
    if (!req.user || !req.userType) {
      return sendUnauthorized(res, 'User not authenticated');
    }
    
    if (!types.includes(req.userType)) {
      return sendForbidden(res, `Access restricted to: ${types.join(', ')}`);
    }
    
    next();
  };
};

/**
 * Middleware to ensure student belongs to specific institution (for institution routes)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const checkInstitutionOwnership = (req, res, next) => {
  if (req.userType === 'institution') {
    // Institution can access their own students
    return next();
  }
  
  if (req.userType === 'student') {
    // Students can only access their own data
    const requestedStudentId = req.params.studentId || req.params.id;
    
    if (requestedStudentId && requestedStudentId !== req.user._id.toString()) {
      return sendForbidden(res, 'You can only access your own data');
    }
    
    // If accessing institution data, check if student belongs to that institution
    const requestedInstitutionId = req.params.institutionId;
    if (requestedInstitutionId && requestedInstitutionId !== req.user.institutionId.toString()) {
      return sendForbidden(res, 'You can only access your own institution data');
    }
  }
  
  next();
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return next(); // No token, continue without authentication
    }
    
    const decoded = verifyToken(token);
    
    // Find user based on type
    let user;
    if (decoded.type === 'student') {
      user = await Student.findById(decoded.id).populate('institutionId', 'name institutionId');
    } else if (decoded.type === 'institution') {
      user = await Institution.findById(decoded.id);
    }
    
    if (user && user.isActive && !user.isLocked) {
      req.user = user;
      req.userType = decoded.type;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};

/**
 * Middleware to check if user profile is completed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireCompleteProfile = (req, res, next) => {
  if (req.userType === 'student' && !req.user.profileCompleted) {
    return sendForbidden(res, 'Please complete your profile first');
  }
  
  next();
};

/**
 * Rate limiting middleware for authentication endpoints
 */
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict rate limiting for failed login attempts
 */
const loginRateLimit = require('express-rate-limit')({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour per IP
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many failed login attempts. Please try again later.',
    timestamp: new Date().toISOString()
  }
});

module.exports = {
  authenticate,
  authorize,
  checkInstitutionOwnership,
  optionalAuth,
  requireCompleteProfile,
  authRateLimit,
  loginRateLimit
};
