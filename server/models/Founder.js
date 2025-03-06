// server/models/Challenge.js
const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
    sno: Number,
    profile: String,
    position: String,
    location: String,
    bio_highlights: String,
    languages: String,
    regional_expertise: String,
    tech_expertise: String,
    buisness_expertise: String,
    social_links: String,
    
    // add other fields if needed
});

module.exports = mongoose.model('Founder', founderSchema);
