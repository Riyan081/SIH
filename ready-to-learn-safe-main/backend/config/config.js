require('dotenv').config();

/**
 * Application configuration
 */
const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/safeed',
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL ? 
      process.env.FRONTEND_URL.split(',').map(url => url.trim()) : 
      ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // Security Configuration
  security: {
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutTime: 30 * 60 * 1000 // 30 minutes
  }
};

/**
 * Validate required configuration
 */
const validateConfig = () => {
  const required = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0 && config.nodeEnv === 'production') {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
  
  if (config.nodeEnv === 'production' && config.jwt.secret === 'fallback-secret-key') {
    console.error('❌ JWT_SECRET must be set in production');
    process.exit(1);
  }
};

// Validate configuration on startup
validateConfig();

module.exports = config;
