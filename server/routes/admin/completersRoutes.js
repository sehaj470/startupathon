const express = require('express');
const router = express.Router();
const { uploadCompleter } = require('../../middlewares/upload');
const { verifyAdmin } = require('../../middlewares/authMiddleware');
const {
  getAllCompleters,
  createCompleter,
  updateCompleter,
  deleteCompleter,
  getCompleterById
} = require('../../controllers/completersController');

// Add CORS headers for admin routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://startupathon-kdu7.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Add debug middleware
  console.log('Completers admin route hit:', req.method, req.path);
  next();
});

// Routes
router.get('/', verifyAdmin, getAllCompleters);
router.post('/', verifyAdmin, uploadCompleter.single('profilePicture'), createCompleter);
router.put('/:id', verifyAdmin, uploadCompleter.single('profilePicture'), updateCompleter);
router.delete('/:id', verifyAdmin, deleteCompleter);
router.get('/:id', verifyAdmin, getCompleterById);

module.exports = router;
