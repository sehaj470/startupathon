require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const testConnection = async () => {
  console.log('=======================================');
  console.log('MongoDB Connection Test');
  console.log('=======================================');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI is not defined in your environment variables');
      console.log('Make sure you have a .env file with MONGO_URI defined');
      process.exit(1);
    }
    
    // Create masked version of the URI for logging
    const maskedUri = process.env.MONGO_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://[username]:[hidden]@'
    );
    console.log('Using MongoDB URI:', maskedUri);
    
    // Try to connect to MongoDB
    console.log('Connecting to MongoDB...');
    const start = Date.now();
    const result = await connectDB();
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    
    if (result && result.error) {
      console.error('Connection failed:', result.error.message);
      process.exit(1);
    }
    
    const state = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    console.log('Connection state:', stateMap[state] || 'unknown');
    
    if (state === 1) {
      console.log('Success! Connected to MongoDB');
      console.log('Connection time:', duration, 'seconds');
      console.log('Database name:', mongoose.connection.name);
      console.log('Database host:', mongoose.connection.host);
      
      // Try to list collections in the database
      console.log('\nCollections in database:');
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        if (collections.length === 0) {
          console.log('No collections found in database');
        } else {
          collections.forEach(collection => {
            console.log(`- ${collection.name}`);
          });
        }
      } catch (err) {
        console.error('Error listing collections:', err.message);
      }
    } else {
      console.error('Failed to connect to MongoDB');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    // Always close the connection
    console.log('\nClosing connection...');
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  }
};

// Run the test
testConnection(); 