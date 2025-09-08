const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * JWT Utility Functions
 */

/**
 * Generate JWT token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: 'safeed-api',
      audience: 'safeed-client'
    });
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'safeed-api',
      audience: 'safeed-client'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'NotBeforeError') {
      throw new Error('Token not active');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  return token.trim() || null;
};

/**
 * Generate refresh token (for future implementation)
 * @param {Object} payload - User data to encode
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: '30d', // Refresh tokens last longer
      issuer: 'safeed-api',
      audience: 'safeed-refresh'
    });
  } catch (error) {
    throw new Error('Refresh token generation failed');
  }
};

/**
 * Verify refresh token (for future implementation)
 * @param {String} refreshToken - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, config.jwt.secret, {
      issuer: 'safeed-api',
      audience: 'safeed-refresh'
    });
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Get token expiry time
 * @param {String} token - JWT token
 * @returns {Date} Token expiry date
 */
const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is about to expire (within next 5 minutes)
 * @param {String} token - JWT token
 * @returns {Boolean} True if token expires soon
 */
const isTokenExpiringSoon = (token) => {
  try {
    const expiryDate = getTokenExpiry(token);
    if (!expiryDate) return true;
    
    const fiveMinutesFromNow = new Date(Date.now() + (5 * 60 * 1000));
    return expiryDate <= fiveMinutesFromNow;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateRefreshToken,
  verifyRefreshToken,
  getTokenExpiry,
  isTokenExpiringSoon
};
