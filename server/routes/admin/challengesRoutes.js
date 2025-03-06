// server/routes/admin/challengesRoutes.js
const express = require('express');
const router = express.Router();
const { uploadChallenge } = require('../../middlewares/upload');
const { verifyAdmin } = require('../../middlewares/authMiddleware');
const {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge
} = require('../../controllers/challengesController');

// All these routes are admin-only
router.get('/', verifyAdmin, getAllChallenges);
router.post('/', verifyAdmin, uploadChallenge.single('image'), createChallenge);
router.put('/:id', verifyAdmin, uploadChallenge.single('image'), updateChallenge);
router.delete('/:id', verifyAdmin, deleteChallenge);

module.exports = router;
