/**
 * SafeEd Backend Server
 * Disaster Preparedness Education System API
 */

// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Local imports
const config = require('./config/config');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow embedding for development
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['X-Total-Count']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware (for tracking)
app.use((req, res, next) => {
  req.requestId = Math.random().toString(36).substring(7);
  res.set('X-Request-ID', req.requestId);
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${req.ip} - ID: ${req.requestId}`);
  next();
});

// API Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SafeEd API - Disaster Preparedness Education System',
    version: '1.0.0',
    environment: config.nodeEnv,
    api_documentation: '/api',
    health_check: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log('🚀 ===============================================');
  console.log(`🌟 SafeEd API Server Started Successfully!`);
  console.log('🚀 ===============================================');
  console.log(`📍 Environment: ${config.nodeEnv.toUpperCase()}`);
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log('🚀 ===============================================');
});

// Export server for testing
module.exports = { app, server };
