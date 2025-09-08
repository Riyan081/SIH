/**
 * Response Utility Functions
 * Provides consistent API response formatting
 */

/**
 * Send successful response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (default: 200)
 * @param {String} message - Success message
 * @param {Object} data - Response data (optional)
 * @param {Object} meta - Additional metadata (optional)
 */
const sendSuccess = (res, statusCode = 200, message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    ...(meta && { meta }),
    timestamp: new Date().toISOString()
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {String} message - Error message
 * @param {Object} errors - Detailed error information (optional)
 */
const sendError = (res, statusCode = 500, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString()
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} validationErrors - Array of validation errors
 */
const sendValidationError = (res, validationErrors) => {
  const errors = validationErrors.map(error => ({
    field: error.path || error.param,
    message: error.message || error.msg,
    value: error.value
  }));
  
  return sendError(res, 400, 'Validation failed', { validation: errors });
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Optional custom message
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, 401, message);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Optional custom message
 */
const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, 403, message);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {String} message - Optional custom message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, 404, message);
};

/**
 * Send internal server error response
 * @param {Object} res - Express response object
 * @param {String} message - Optional custom message
 * @param {Object} error - Error object (for debugging)
 */
const sendServerError = (res, message = 'Internal server error', error = null) => {
  // Log error for debugging (in production, use proper logging)
  if (error) {
    console.error('Server Error:', error);
  }
  
  return sendError(res, 500, message);
};

/**
 * Send created response (for successful resource creation)
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Created resource data
 */
const sendCreated = (res, message, data) => {
  return sendSuccess(res, 201, message, data);
};

/**
 * Send no content response (for successful deletion)
 * @param {Object} res - Express response object
 */
const sendNoContent = (res) => {
  return res.status(204).send();
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Array} data - Array of data items
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @param {Number} total - Total number of items
 */
const sendPaginated = (res, message, data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  const meta = {
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext,
      hasPrev,
      ...(hasNext && { nextPage: page + 1 }),
      ...(hasPrev && { prevPage: page - 1 })
    }
  };
  
  return sendSuccess(res, 200, message, data, meta);
};

/**
 * Handle async route errors
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function with error handling
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendServerError,
  sendCreated,
  sendNoContent,
  sendPaginated,
  asyncHandler
};
