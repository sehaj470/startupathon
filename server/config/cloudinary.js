const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine for challenges
const challengeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'startupathon/challenges',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf']
  }
});

// Create storage engine for completers
const completerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'startupathon/completers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf']
  }
});

// Create multer upload instances
const uploadChallenge = multer({ storage: challengeStorage });
const uploadCompleter = multer({ storage: completerStorage });

module.exports = {
  cloudinary,
  uploadChallenge,
  uploadCompleter
}; 