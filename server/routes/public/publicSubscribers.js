const express = require('express');
const router = express.Router();
const Subscriber = require('../../models/Subscriber');

// Set explicit CORS headers on all routes in this router
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// GET all subscribers
router.get('/', async (req, res) => {
  try {
    console.log('Fetching subscribers from database...');
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    console.log(`Found ${subscribers.length} subscribers`);
    
    // Set content type explicitly to ensure JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// POST new subscriber
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    
    // Create new subscriber
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    
    res.status(201).json({ message: 'Subscription successful', subscriber });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    res.status(500).json({ error: 'Failed to create subscriber' });
  }
});

module.exports = router;