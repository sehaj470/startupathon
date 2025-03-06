const Founder = require('../models/Founder');

exports.getAllFounders = async (req, res) => {
  try {
    const founders = await Founder.find().sort({ _id: 1 });
    res.json(founders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFounder = async (req, res) => {
  try {
    const newFounder = new Founder(req.body);
    await newFounder.save();
    res.status(201).json(newFounder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateFounder = async (req, res) => {
  try {
    const updated = await Founder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFounder = async (req, res) => {
  try {
    await Founder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Founder deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
