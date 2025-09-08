const { body, param, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/response');

/**
 * Validation middleware to handle express-validator results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }
  
  next();
};

/**
 * Student registration validation rules
 */
const validateStudentRegistration = [
  body('institutionId')
    .notEmpty()
    .withMessage('Institution ID is required')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Institution ID must be between 1 and 50 characters'),
    
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('rollNo')
    .notEmpty()
    .withMessage('Roll number is required')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Roll number must be a number between 1 and 999999'),
    
  body('division')
    .trim()
    .notEmpty()
    .withMessage('Division is required')
    .isLength({ max: 10 })
    .withMessage('Division cannot exceed 10 characters'),
    
  body('class')
    .trim()
    .notEmpty()
    .withMessage('Class is required')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Class must be valid (1-12 for school)'),
    
  body('admissionYear')
    .notEmpty()
    .withMessage('Admission year is required')
    .isInt({ min: 2000, max: new Date().getFullYear() + 5 })
    .withMessage('Admission year must be between 2000 and ' + (new Date().getFullYear() + 5)),
    
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
    
  body('parentPhone')
    .trim()
    .notEmpty()
    .withMessage('Parent phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit parent mobile number'),
    
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  handleValidationErrors
];

/**
 * Institution registration validation rules
 */
const validateInstitutionRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Institution name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Institution name must be between 2 and 100 characters'),
    
  body('institutionId')
    .trim()
    .notEmpty()
    .withMessage('Institution ID is required')
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Institution ID can only contain uppercase letters, numbers, hyphens and underscores'),
    
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one letter, one number, and one special character'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
    
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2 })
    .withMessage('State name must be at least 2 characters'),
    
  body('location.district')
    .trim()
    .notEmpty()
    .withMessage('District is required')
    .isLength({ min: 2 })
    .withMessage('District name must be at least 2 characters'),
    
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2 })
    .withMessage('City name must be at least 2 characters'),
    
  body('location.pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
    
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
    
  handleValidationErrors
];

/**
 * Login validation rules
 */
const validateLogin = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  // Optional institution ID for student login
  body('institutionId')
    .optional()
    .isMongoId()
    .withMessage('Invalid institution ID format'),
    
  handleValidationErrors
];

/**
 * Password change validation rules
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one letter and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
    
  handleValidationErrors
];

/**
 * Profile update validation rules
 */
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
    
  body('parentPhone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit parent mobile number'),
    
  handleValidationErrors
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (field) => [
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} format`),
    
  handleValidationErrors
];

/**
 * Email validation only
 */
const validateEmail = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  handleValidationErrors
];

/**
 * Reset password validation
 */
const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateStudentRegistration,
  validateInstitutionRegistration,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  validateObjectId,
  validateEmail,
  validatePasswordReset
};
