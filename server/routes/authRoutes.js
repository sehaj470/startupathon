// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Set explicit CORS headers on all routes in this router
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Auth routes
router.post('/register', registerAdmin);  // Admin registration
router.post('/login', loginAdmin);       // Admin login

module.exports = router;
