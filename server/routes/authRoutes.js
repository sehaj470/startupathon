// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/authController');

router.post('/register', registerAdmin); // For creating admin user
router.post('/login', loginAdmin);       // Admin login

module.exports = router;
