// server/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
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

// CORS configuration - updated for production
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL || 'https://startupathon.vercel.app' 
        : 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Health check endpoint for Vercel - placed before DB connection to ensure it works even if DB fails
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit');
    res.status(200).json({ status: 'ok' });
});

// Connect to DB with better error handling
let dbConnected = false;
try {
    console.log('Attempting to connect to MongoDB...');
    connectDB()
        .then(() => {
            dbConnected = true;
            console.log('MongoDB connected successfully');
        })
        .catch(error => {
            console.error('Failed to connect to MongoDB:', error);
        });
} catch (error) {
    console.error('Error in DB connection setup:', error);
}

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
