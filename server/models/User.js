// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }, 
  // or you can have multiple roles if needed
});

module.exports = mongoose.model('User', userSchema);
