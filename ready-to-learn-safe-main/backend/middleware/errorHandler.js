const { sendError } = require('../utils/response');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // MongoDB CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    return sendError(res, 400, message);
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `Duplicate value for field: ${field}`;
    return sendError(res, 409, message);
  }

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return sendError(res, 400, 'Validation failed', { details: messages });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Rate Limit Error
  if (err.status === 429) {
    return sendError(res, 429, 'Too many requests. Please try again later.');
  }

  // Default server error
  sendError(res, 500, 'Internal server error');
};

/**
 * 404 Not Found middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
};

/**
 * Async error wrapper (alternative to try-catch in controllers)
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
const asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncErrorHandler
};
