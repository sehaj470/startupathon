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

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      // Instead of throwing an error, allow the request but log it
      // This helps prevent CORS errors during development/debugging
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Add a middleware to manually set CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());

// Health check endpoint for Vercel - placed before DB connection to ensure it works even if DB fails
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit');
    // Set CORS headers explicitly for this endpoint
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
    console.log('DB status endpoint hit');
    // Set CORS headers explicitly for this endpoint
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState === 1) {
            console.log('Database is connected');
            res.status(200).json({ status: 'connected', message: 'Database is connected' });
        } else {
            console.log('Database is not connected, attempting to connect...');
            // Try to connect to the database
            await connectDB();
            if (mongoose.connection.readyState === 1) {
                console.log('Database connection successful');
                res.status(200).json({ status: 'connected', message: 'Database connection successful' });
            } else {
                console.log('Database connection failed');
                res.status(500).json({ status: 'error', message: 'Database connection failed' });
            }
        }
    } catch (error) {
        console.error('Error checking database status:', error);
        res.status(500).json({ status: 'error', message: 'Error checking database status', error: error.message });
    }
});

// Connect to DB with better error handling
let dbConnected = false;
let dbConnectionAttempted = false;

const initializeDatabase = async () => {
    if (dbConnectionAttempted) return;
    dbConnectionAttempted = true;
    
    try {
        console.log('Attempting to connect to MongoDB...');
        await connectDB();
        dbConnected = true;
        console.log('MongoDB connected successfully');
        
        // Log connection status periodically
        setInterval(() => {
            const status = mongoose.connection.readyState;
            const statusText = status === 1 ? 'connected' : 
                              status === 2 ? 'connecting' : 
                              status === 3 ? 'disconnecting' : 'disconnected';
            console.log(`MongoDB connection status: ${statusText} (${status})`);
            
            // If disconnected, try to reconnect
            if (status === 0) {
                console.log('MongoDB disconnected, attempting to reconnect...');
                connectDB()
                    .then(() => console.log('MongoDB reconnected successfully'))
                    .catch(error => console.error('Failed to reconnect to MongoDB:', error));
            }
        }, 60000); // Check every minute
    } catch (error) {
        console.error('Error in DB connection setup:', error);
    }
};

// Initialize database connection
initializeDatabase();

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
