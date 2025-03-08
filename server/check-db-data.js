require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import models
const Challenge = require('./models/Challenge');
const Completer = require('./models/Completer');
const Subscriber = require('./models/Subscriber');
const User = require('./models/User');

async function checkDatabaseData() {
  console.log('=== Database Data Check ===');
  
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');
    
    // Check challenges
    const challenges = await Challenge.find();
    console.log(`Challenges: ${challenges.length} found`);
    if (challenges.length > 0) {
      console.log('Sample challenge:', {
        id: challenges[0]._id,
        title: challenges[0].title,
        createdAt: challenges[0].createdAt
      });
    }
    
    // Check completers
    const completers = await Completer.find();
    console.log(`Completers: ${completers.length} found`);
    if (completers.length > 0) {
      console.log('Sample completer:', {
        id: completers[0]._id,
        name: completers[0].name,
        createdAt: completers[0].createdAt
      });
    }
    
    // Check subscribers
    const subscribers = await Subscriber.find();
    console.log(`Subscribers: ${subscribers.length} found`);
    if (subscribers.length > 0) {
      console.log('Sample subscriber:', {
        id: subscribers[0]._id,
        email: subscribers[0].email,
        createdAt: subscribers[0].createdAt
      });
    }
    
    // Check users
    const users = await User.find();
    console.log(`Users: ${users.length} found`);
    if (users.length > 0) {
      console.log('Sample user:', {
        id: users[0]._id,
        email: users[0].email,
        role: users[0].role
      });
    }
    
    console.log('\n=== Database Check Complete ===');
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the check
checkDatabaseData(); 