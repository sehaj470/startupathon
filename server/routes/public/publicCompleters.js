const express = require('express');
const router = express.Router();
const Completer = require('../../models/Completer');

// Set explicit CORS headers on all routes in this router
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// GET all completers
router.get('/', async (req, res) => {
  try {
    const completers = await Completer.find().sort({ createdAt: -1 });
    res.status(200).json(completers);
  } catch (error) {
    console.error('Error fetching completers:', error);
    res.status(500).json({ error: 'Failed to fetch completers' });
  }
});

// GET single completer by ID
router.get('/:id', async (req, res) => {
  try {
    const completer = await Completer.findById(req.params.id);
    if (!completer) {
      return res.status(404).json({ error: 'Completer not found' });
    }
    res.status(200).json(completer);
  } catch (error) {
    console.error('Error fetching completer:', error);
    res.status(500).json({ error: 'Failed to fetch completer' });
  }
});

module.exports = router;