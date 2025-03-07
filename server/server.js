// server/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const challengeRoutes = require('./routes/admin/challengesRoutes');
const founderRoutes = require('./routes/admin/foundersRoutes');
const completerRoutes = require('./routes/admin/completersRoutes');
const subscriberRoutes = require('./routes/admin/subscribersRoutes');
const authRoutes = require('./routes/authRoutes');
const publicChallenges = require('./routes/public/publicChallenges');
const publicCompleters = require('./routes/public/publicCompleters');
const publicSubscribers = require('./routes/public/publicSubscribers');

const app = express();

// CORS configuration - updated for production
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL || 'https://your-frontend-domain.vercel.app' 
        : 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body
    });
    next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/challenges', challengeRoutes);
app.use('/api/admin/founders', founderRoutes);
app.use('/api/admin/completers', completerRoutes);
app.use('/api/admin/subscribers', subscriberRoutes);

app.use('/api/subscribers', publicSubscribers);
app.use('/api/challenges', publicChallenges);
app.use('/api/completers', publicCompleters);

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless functions
module.exports = app;
