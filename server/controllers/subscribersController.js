const Subscriber = require('../models/Subscriber');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

exports.getAllSubscribers = async (req, res) => {
  try {
    console.log('Getting all subscribers - Admin request');
    
    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting to connect...');
      await connectDB();
    }
    
    // Set content type explicitly
    res.setHeader('Content-Type', 'application/json');
    
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';

    console.log(`Pagination: page=${page}, limit=${limit}, search=${search}`);

    const query = search 
      ? { email: { $regex: search, $options: 'i' } }
      : {};

    // Get total count for pagination
    const total = await Subscriber.countDocuments(query);
    
    // Get subscribers with pagination
    const subscribers = await Subscriber.find(query)
      .sort({ subscriptionDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(`Found ${subscribers.length} subscribers (total: ${total})`);
    
    // Return subscribers with pagination info
    res.status(200).json({
      subscribers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error('Error getting subscribers:', err);
    res.status(500).json({ 
      error: 'Failed to get subscribers',
      message: err.message 
    });
  }
};

exports.createSubscriber = async (req, res) => {
  try {
    const existing = await Subscriber.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    const subscriber = new Subscriber({
      email: req.body.email,
      subscriptionDate: new Date()
    });
    
    await subscriber.save();
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existing = await Subscriber.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      { email },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};