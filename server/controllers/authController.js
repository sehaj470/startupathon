// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');

exports.registerAdmin = async (req, res) => {
  try {
    // Ensure database connection is established before proceeding
    console.log('Ensuring database connection before admin registration...');
    await connectDB();
    console.log('Database connection verified for admin registration');
    
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user with admin role
    const user = new User({
      name,
      email,
      password,
      role: 'admin'
    });
    
    await user.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    // Ensure database connection is established before proceeding
    console.log('Ensuring database connection before authentication...');
    await connectDB();
    console.log('Database connection verified for authentication');
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Log the authentication attempt (without password)
    console.log(`Authentication attempt for email: ${email}`);

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`Authentication failed: User with email ${email} not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log(`Authentication failed: Invalid password for email ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      console.log(`Authentication failed: User ${email} is not an admin`);
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Add explicit CORS headers for authentication endpoints
    res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log(`Authentication successful for admin user: ${email}`);
    
    res.status(200).json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};
