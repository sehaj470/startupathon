const { uploadChallenge, uploadCompleter } = require('../config/cloudinary');

// Export the Cloudinary upload middleware
module.exports = {
  uploadChallenge,
  uploadCompleter
};