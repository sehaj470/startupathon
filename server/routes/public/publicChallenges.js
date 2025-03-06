const express = require('express');
const router = express.Router();
const Challenge = require('../../models/Challenge');

// GET /api/challenges - returns all visible challenges
router.get('/', async (req, res) => {
  try {
    // Only return challenges that are marked visible
    const challenges = await Challenge.find({ visible: true }).sort({ _id: 1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
