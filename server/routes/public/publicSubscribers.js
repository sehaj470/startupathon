const express = require('express');
const router = express.Router();
const Subscriber = require('../../models/Subscriber');

// POST /api/subscribers - Create new subscriber
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check for duplicate email
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    const subscriber = new Subscriber({
      email,
      subscriptionDate: new Date()
    });
    
    await subscriber.save();
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;