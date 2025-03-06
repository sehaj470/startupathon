const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create base uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create subdirectories for challenges and completers
const challengesDir = path.join(uploadsDir, 'challenges');
const completersDir = path.join(uploadsDir, 'completers');

[challengesDir, completersDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Configure storage for challenges
const challengeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, challengesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'challenge-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for completers
const completerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, completersDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'completer-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Common file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};


const uploadChallenge = multer({
  storage: challengeStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB
  }
});

const uploadCompleter = multer({
  storage: completerStorage,  
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB
  }
});

module.exports = {
  uploadChallenge,
  uploadCompleter
};