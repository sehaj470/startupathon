// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
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
    console.log('Database name from URI:', dbName);
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return mongoose.connection;
    }
    
    // Configure mongoose connection options for Vercel environment
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
      // Explicitly set directConnection to false for Atlas
      directConnection: false,
      // No auto_reconnect for Vercel serverless functions
      autoReconnect: false
    };
    
    console.log('Mongoose connection options:', JSON.stringify(options));
    
    // Connect to MongoDB with promise
    console.log('Attempting mongoose.connect...');
    const conn = await mongoose.connect(uri, options);
    
    console.log('MongoDB Connected Successfully!');
    console.log(`Connected to host: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Set up connection error handlers for production resilience
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Check the readyState again after connection
    console.log('Final connection state:', mongoose.connection.readyState);
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    // Log detailed error information for debugging
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Please check your MONGO_URI format.');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB servers. This might be due to:');
      console.error('1. Network connectivity issues');
      console.error('2. MongoDB Atlas IP whitelist restrictions - Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist');
      console.error('3. Incorrect database credentials');
      
      // Try to extract more details from the error
      if (error.message.includes('authentication failed')) {
        console.error('Authentication failed - check username and password');
      } else if (error.message.includes('timed out')) {
        console.error('Connection timed out - check network and IP whitelist');
      }
    }
    
    // Return the error for better handling upstream
    return { error };
  }
};

module.exports = connectDB;
