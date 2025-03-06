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

// Add debug middleware
router.use((req, res, next) => {
  console.log('Completers route hit:', req.path);
  next();
});

// Routes
router.get('/', verifyAdmin, getAllCompleters);
router.post('/', verifyAdmin, uploadCompleter.single('profilePicture'), createCompleter);
router.put('/:id', verifyAdmin, uploadCompleter.single('profilePicture'), updateCompleter);
router.delete('/:id', verifyAdmin, deleteCompleter);
router.get('/:id', verifyAdmin, getCompleterById);

module.exports = router;
