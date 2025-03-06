const Subscriber = require('../models/Subscriber');

exports.getAllSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';

    const query = search 
      ? { email: { $regex: search, $options: 'i' } }
      : {};

    const total = await Subscriber.countDocuments(query);
    const subscribers = await Subscriber.find(query)
      .sort({ subscriptionDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      subscribers,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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