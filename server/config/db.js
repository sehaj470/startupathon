// server/config/db.js
const mongoose = require('mongoose');

// Cached connection
let cachedConnection = null;

const connectDB = async () => {
  try {
    console.log('MongoDB connection requested...');
    
    // If we have a cached connection, return it
    if (cachedConnection && mongoose.connection.readyState === 1) {
      console.log('Using cached MongoDB connection');
      return cachedConnection;
    }
    
    // Get MONGO_URI from environment
    const uri = process.env.MONGO_URI;
    
    // Check if URI exists and is properly formatted
    if (!uri) {
      console.error('Error: MONGO_URI is not defined in environment');
      return { error: new Error('MongoDB URI is not defined') };
    }
    
    if (!uri.includes('mongodb')) {
      console.error('Error: MONGO_URI does not appear to be a valid MongoDB connection string');
      return { error: new Error('Invalid MongoDB connection string format') };
    }
    
    // Log URI for debugging (hiding credentials)
    const maskedUri = uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://[username]:[hidden]@');
    console.log('MongoDB URI:', maskedUri);
    
    // Debug info about database name
    const dbName = uri.split('/').pop().split('?')[0];
    console.log('Target database name:', dbName);
    
    // Configure mongoose connection options optimized for serverless
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Reduced timeout for serverless
      connectTimeoutMS: 10000,         // Reduced timeout for serverless
      heartbeatFrequencyMS: 30000,     // Longer heartbeat interval 
      // Explicitly set for Atlas
      directConnection: false,
      // Important for serverless:
      bufferCommands: false           // Disable command buffering
    };
    
    console.log('Attempting mongoose.connect with serverless-optimized options...');
    
    // Connect to MongoDB
    const conn = await mongoose.connect(uri, options);
    
    console.log('MongoDB Connected Successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Cache the connection
    cachedConnection = conn;
    
    // Setup minimal event handlers for serverless environment
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedConnection = null; // Clear cache on error
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null; // Clear cache on disconnection
    });
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // Log more detailed error information
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string format');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB servers. Common causes:');
      console.error('1. IP whitelist restrictions - Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist');
      console.error('2. Network connectivity issues from Vercel to MongoDB Atlas');
      console.error('3. Incorrect credentials');
    }
    
    // Return the error for better handling upstream
    return { error };
  }
};

module.exports = connectDB;
