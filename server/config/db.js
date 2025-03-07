// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? `${process.env.MONGO_URI.substring(0, 20)}...` : 'Not defined');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }
    
    // Configure mongoose connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
    };
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Set up connection error handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected, attempting to reconnect...');
      setTimeout(() => {
        connectDB();
      }, 5000); // Try to reconnect after 5 seconds
    });
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // Log more details about the error
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Please check your MONGO_URI.');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB servers. Please check your network or MongoDB Atlas status.');
    }
    
    // Don't exit the process, just return the error
    return { error };
  }
};

module.exports = connectDB;
