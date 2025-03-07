const express = require('express');
const router = express.Router();
const Challenge = require('../../models/Challenge');

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

// GET all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// GET single challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.status(200).json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

module.exports = router;
