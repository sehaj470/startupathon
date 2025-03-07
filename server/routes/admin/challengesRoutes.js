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

// Add CORS headers for admin routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// All these routes are admin-only
router.get('/', verifyAdmin, getAllChallenges);
router.post('/', verifyAdmin, uploadChallenge.single('image'), createChallenge);
router.put('/:id', verifyAdmin, uploadChallenge.single('image'), updateChallenge);
router.delete('/:id', verifyAdmin, deleteChallenge);

module.exports = router;
