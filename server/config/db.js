// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Get MONGO_URI from environment
    const uri = process.env.MONGO_URI;
    
    // Log partial URI for debugging (hiding credentials)
    if (uri) {
      const maskedUri = uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://[username]:[hidden]@');
      console.log('MongoDB URI:', maskedUri);
    } else {
      console.error('MONGO_URI is not defined in environment');
      throw new Error('MongoDB URI is not defined');
    }
    
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
      // No IP restriction
      directConnection: false,
    };
    
    // Connect to MongoDB
    const conn = await mongoose.connect(uri, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Set up connection error handlers for production resilience
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected, attempting to reconnect...');
      setTimeout(() => {
        connectDB().catch(err => console.error('Reconnection failed:', err));
      }, 5000); // Try to reconnect after 5 seconds
    });
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // Log detailed error information for debugging
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Please check your MONGO_URI.');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB servers. This might be due to:');
      console.error('1. Network connectivity issues');
      console.error('2. MongoDB Atlas IP whitelist restrictions');
      console.error('3. Incorrect database credentials');
      console.error('Solution: Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist');
    }
    
    // Return the error rather than throwing it
    return { error };
  }
};

module.exports = connectDB;
