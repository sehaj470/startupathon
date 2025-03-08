const Completer = require('../models/Completer');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

exports.getAllCompleters = async (req, res) => {
  try {
    console.log('Getting all completers - Admin request');
    
    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting to connect...');
      await connectDB();
    }
    
    // Set content type explicitly
    res.setHeader('Content-Type', 'application/json');
    
    // Get all completers, not just visible ones for admin
    const completers = await Completer.find().sort({ createdAt: -1 });
    
    console.log(`Found ${completers.length} completers`);
    
    // Return completers as JSON
    res.status(200).json(completers);
  } catch (err) {
    console.error('Error getting completers:', err);
    res.status(500).json({ 
      error: 'Failed to get completers',
      message: err.message 
    });
  }
};

exports.createCompleter = async (req, res) => {
  try {
    console.log('Received request:', {
      body: req.body,
      file: req.file
    });

    if (!req.body.projectName || !req.body.profile || !req.body.position) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: req.body
      });
    }

    const completerData = {
      ...req.body,
      visible: req.body.visible === 'true',
      profilePicture: req.file ? req.file.path : null
    };

    console.log('Creating completer with data:', completerData);

    const newCompleter = new Completer(completerData);
    await newCompleter.save();
    res.status(201).json(newCompleter);
  } catch (err) {
    console.error('Error creating completer:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateCompleter = async (req, res) => {
  try {
      const updateData = {
          ...req.body,
          visible: req.body.visible === 'true'
      };
      
      if (req.file) {
          updateData.profilePicture = req.file.path;
      }

      const updated = await Completer.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
      );
      res.json(updated);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};

exports.deleteCompleter = async (req, res) => {
  try {
      await Completer.findByIdAndDelete(req.params.id);
      res.json({ message: 'Completer deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

exports.getCompleterById = async (req, res) => {
  try {
    const completer = await Completer.findById(req.params.id);
    if (!completer) {
      return res.status(404).json({ error: 'Completer not found' });
    }
    res.json(completer);
  } catch (err) {
    console.error('Error fetching completer:', err);
    res.status(500).json({ error: err.message });
  }
};