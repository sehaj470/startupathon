// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log the MongoDB URI (without password) for debugging
    const uriWithoutPassword = process.env.MONGO_URI.replace(
      /mongodb(\+srv)?:\/\/[^:]+:([^@]+)@/,
      'mongodb$1://[username]:[hidden]@'
    );
    console.log('Connecting to MongoDB:', uriWithoutPassword);
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('DB connection error:', error.message);
    // Don't exit the process, let the server handle the error
    throw error;
  }
};

module.exports = connectDB;
