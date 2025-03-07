// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log the MongoDB URI (without password) for debugging
    const uriWithoutPassword = process.env.MONGO_URI 
      ? process.env.MONGO_URI.replace(
          /mongodb(\+srv)?:\/\/[^:]+:([^@]+)@/,
          'mongodb$1://[username]:[hidden]@'
        )
      : 'MONGO_URI is not defined';
    
    console.log('Connecting to MongoDB:', uriWithoutPassword);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    // Set connection options with timeout
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
      connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('DB connection error:', error.message);
    
    // More detailed error logging
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string format');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server');
      console.error('Please check your network connection and MongoDB Atlas whitelist settings');
    }
    
    // Don't exit the process, let the server handle the error
    throw error;
  }
};

module.exports = connectDB;
