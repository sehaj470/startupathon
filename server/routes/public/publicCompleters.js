const express = require('express');
const router = express.Router();
const Completer = require('../../models/Completer');

// GET /api/completers - returns all visible completers
router.get('/', async (req, res) => {
  try {
    const completers = await Completer.find({ visible: true }).sort({ _id: 1 });
    res.json(completers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/completers/:id - returns a specific completer
router.get('/:id', async (req, res) => {
  try {
    const completer = await Completer.findById(req.params.id);
    if (!completer) {
      return res.status(404).json({ error: 'Completer not found' });
    }
    res.json(completer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;