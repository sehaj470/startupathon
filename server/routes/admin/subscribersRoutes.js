const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../../middlewares/authMiddleware');
const {
  getAllSubscribers,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
} = require('../../controllers/subscribersController');

// Admin routes
router.get('/', verifyAdmin, getAllSubscribers);
router.post('/', verifyAdmin, createSubscriber);
router.put('/:id', verifyAdmin, updateSubscriber);
router.delete('/:id', verifyAdmin, deleteSubscriber);

module.exports = router;