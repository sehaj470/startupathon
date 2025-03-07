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
const allowedOrigins = [
  'https://startupathon.vercel.app',
  'https://startupathon-kdu7.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Still allow all origins for now, but log blocked ones
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint for Vercel - placed before DB connection to ensure it works even if DB fails
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit');
    res.status(200).json({ status: 'ok' });
});

// Database connection status endpoint
app.get('/api/db-status', async (req, res) => {
    console.log('DB status check endpoint hit');
    try {
        const dbStatus = mongoose.connection.readyState;
        const statusMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        // If not connected, try to connect
        if (dbStatus !== 1) {
            console.log('Database not connected, attempting to connect...');
            try {
                await connectDB();
                console.log('Database connected successfully');
            } catch (error) {
                console.error('Failed to connect to database:', error);
            }
        }
        
        // Get the updated status
        const updatedStatus = mongoose.connection.readyState;
        
        res.status(200).json({ 
            status: statusMap[updatedStatus] || 'unknown',
            readyState: updatedStatus,
            connected: updatedStatus === 1
        });
    } catch (error) {
        console.error('Error checking database status:', error);
        res.status(500).json({ 
            error: 'Error checking database status', 
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
        });
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
