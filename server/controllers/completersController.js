const Completer = require('../models/Completer');

exports.getAllCompleters = async (req, res) => {
  try {
      const completers = await Completer.find({ visible: true });
      res.json(completers);
  } catch (err) {
      res.status(500).json({ error: err.message });
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
      profilePicture: req.file ? req.file.filename : null
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
          updateData.profilePicture = req.file.filename;
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