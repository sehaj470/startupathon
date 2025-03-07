const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Get detailed system and environment info
router.get('/system', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  const systemInfo = {
    timestamp: new Date().toISOString(),
    node: {
      version: process.version,
      env: process.env.NODE_ENV,
      uptime: process.uptime(),
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
    },
    request: {
      ip: req.ip,
      headers: req.headers,
      originalUrl: req.originalUrl,
      protocol: req.protocol,
      host: req.get('host'),
    }
  };
  
  res.status(200).json(systemInfo);
});

// Test MongoDB connection
router.get('/db-test', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    // Try connecting to MongoDB
    const result = await connectDB();
    
    if (result && result.error) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        error: result.error.message,
        name: result.error.name
      });
    }
    
    // Successful connection - try to get collections info
    let collections = [];
    try {
      collections = await mongoose.connection.db.listCollections().toArray();
    } catch (err) {
      console.error('Error listing collections:', err);
    }
    
    res.status(200).json({
      status: 'success',
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: mongoose.connection.readyState,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Diagnostics DB test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error testing database connection',
      error: error.message
    });
  }
});

// Echo the request body, headers, etc.
router.post('/echo', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    message: 'Echo response',
    requestBody: req.body,
    requestHeaders: req.headers,
    requestMethod: req.method,
    requestUrl: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Test CORS
router.get('/cors-test', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  res.status(200).json({
    message: 'CORS test successful',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 