const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../../middlewares/authMiddleware');
const {
  getAllFounders,
  createFounder,
  updateFounder,
  deleteFounder
} = require('../../controllers/foundersController');

router.get('/', verifyAdmin, getAllFounders);
router.post('/', verifyAdmin, createFounder);
router.put('/:id', verifyAdmin, updateFounder);
router.delete('/:id', verifyAdmin, deleteFounder);

module.exports = router;
