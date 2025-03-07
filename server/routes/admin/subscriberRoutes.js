const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../../middlewares/authMiddleware');
const {
  getAllSubscribers,
  createSubscriber,
  deleteSubscriber
} = require('../../controllers/subscribersController');

// Add CORS headers for admin routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log('Subscribers admin route hit:', req.method, req.path);
  next();
});

router.get('/', verifyAdmin, getAllSubscribers);
router.post('/', verifyAdmin, createSubscriber);
router.delete('/:id', verifyAdmin, deleteSubscriber);

module.exports = router; 