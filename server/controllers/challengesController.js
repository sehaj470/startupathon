// server/controllers/challengesController.js
const Challenge = require('../models/Challenge');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

exports.getAllChallenges = async (req, res) => {
  try {
    console.log('Getting all challenges - Admin request');
    
    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting to connect...');
      await connectDB();
    }
    
    // Set content type explicitly
    res.setHeader('Content-Type', 'application/json');
    
    // Get challenges from database
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    
    console.log(`Found ${challenges.length} challenges`);
    
    // Return challenges as JSON
    res.status(200).json(challenges);
  } catch (err) {
    console.error('Error getting challenges:', err);
    res.status(500).json({ 
      error: 'Failed to get challenges',
      message: err.message 
    });
  }
};

exports.createChallenge = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    if (!req.body.title || !req.body.funding || !req.body.deadline || !req.body.description) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: {
          title: !!req.body.title,
          funding: !!req.body.funding,
          deadline: !!req.body.deadline,
          description: !!req.body.description
        }
      });
    }

    const challengeData = {
      title: req.body.title,
      funding: req.body.funding,
      deadline: new Date(req.body.deadline),
      description: req.body.description,
      visible: req.body.visible === 'true' || req.body.visible === true
    };

    if (req.file) {
      challengeData.image = req.file.path;
    }

    console.log('Creating challenge with data:', challengeData);

    const newChallenge = new Challenge(challengeData);
    await newChallenge.save();
    
    console.log('Created challenge:', newChallenge);
    res.status(201).json(newChallenge);
  } catch (err) {
    console.error('Error creating challenge:', err);
    res.status(400).json({ error: err.message });
  }
};

// update, delete, etc...
exports.updateChallenge = async (req, res) => {
  try {
    console.log('Update request received:', {
      body: req.body,
      file: req.file
    });

    const updateData = {
      ...req.body,
      // Properly handle visibility boolean conversion
      visible: req.body.visible === 'true' || req.body.visible === true
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    console.log('Updating challenge with data:', updateData);

    const updated = await Challenge.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log('Updated challenge:', updated);
    res.json(updated);
  } catch (err) {
    console.error('Error updating challenge:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Challenge deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
