// server/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { checkEnvVars } = require('./checkEnv');

const challengeRoutes = require('./routes/admin/challengesRoutes');
const founderRoutes = require('./routes/admin/foundersRoutes');
const completerRoutes = require('./routes/admin/completersRoutes');
const subscriberRoutes = require('./routes/admin/subscribersRoutes');
const authRoutes = require('./routes/authRoutes');
const publicChallenges = require('./routes/public/publicChallenges');
const publicCompleters = require('./routes/public/publicCompleters');
const publicSubscribers = require('./routes/public/publicSubscribers');
const diagnosticsRoutes = require('./routes/diagnostics');

// Create Express app
const app = express();

// Log startup information
console.log('Server starting...');
console.log('Node environment:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);

// Check environment variables
try {
  checkEnvVars();
} catch (error) {
  console.error('Environment variable check failed:', error);
  // Continue execution even if env check fails
}

// CORS configuration - updated for production with multiple allowed origins
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',') 
  : ['https://startupathon-kdu7.vercel.app', 'https://startupathon.vercel.app', 'http://localhost:5173'];

console.log('Allowed origins:', allowedOrigins);

// CORS preflight OPTIONS handler - place before other routes
app.options('*', cors());

// Main CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      // Return true for all origins during development but log blocked ones
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Add a middleware to ensure CORS headers are set on all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  
  // Set CORS headers for all requests
  if (origin && (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*'))) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // For requests without origin or from unknown origins, use the first allowed origin
    // This is more secure than using a wildcard
    res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());

// Initialize database connection
const initializeDatabase = async () => {
  try {
    console.log('Initializing database connection...');
    const result = await connectDB();
    
    if (result && result.error) {
      console.error('Database initialization failed:', result.error);
      return false;
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error);
    return false;
  }
};

// Ensure database functions are called on startup
(async function() {
  console.log('Running startup sequence...');
  await initializeDatabase();
})();

// Database connection middleware - connect for each request
app.use(async (req, res, next) => {
  // Skip database connection for health check 
  if (req.path === '/api/health') {
    return next();
  }
  
  try {
    // Try to connect to the database if needed
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to database from middleware for path:', req.path);
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    // Continue anyway - let the endpoint handle the error
    next();
  }
});

// Health check endpoint - simple, no DB connection required
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit');
    
    // Set CORS headers explicitly for this endpoint
    res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server is running',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
});

// Simplified database status endpoint
app.get('/api/db-status', async (req, res) => {
    console.log('DB status endpoint hit');
    
    // Set CORS headers explicitly for this endpoint
    res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    try {
        // Create a dedicated connection for this request
        const result = await connectDB();
        
        if (result && result.error) {
            // Return error with helpful information
            return res.status(500).json({
                status: 'error',
                message: 'Database connection failed',
                error: result.error.message,
                suggestions: [
                    'Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)',
                    'Verify database credentials',
                    'Check Vercel environment variables'
                ]
            });
        }
        
        // Check connection state
        const readyState = mongoose.connection.readyState;
        if (readyState === 1) {
            res.status(200).json({
                status: 'connected',
                message: 'Database connected successfully',
                database: mongoose.connection.name,
                host: mongoose.connection.host
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Database not connected',
                readyState: readyState
            });
        }
    } catch (error) {
        console.error('Error in /api/db-status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error checking database status',
            error: error.message
        });
    }
});

// Request logging middleware
app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        path: req.path,
        query: req.query,
        headers: {
            'user-agent': req.headers['user-agent'],
            'content-type': req.headers['content-type'],
            'authorization': req.headers['authorization'] ? 'Bearer [hidden]' : 'none'
        }
    });
    next();
});

// API routes with error handling
const setupRoute = (path, router) => {
    try {
        app.use(path, router);
    } catch (error) {
        console.error(`Error setting up route ${path}:`, error);
    }
};

setupRoute('/api/auth', authRoutes);
setupRoute('/api/admin/challenges', challengeRoutes);
setupRoute('/api/admin/founders', founderRoutes);
setupRoute('/api/admin/completers', completerRoutes);
setupRoute('/api/admin/subscribers', subscriberRoutes);
setupRoute('/api/subscribers', publicSubscribers);
setupRoute('/api/challenges', publicChallenges);
setupRoute('/api/completers', publicCompleters);
setupRoute('/api/diagnostics', diagnosticsRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.path} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Server error', 
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless functions
module.exports = app;
