// server/models/Challenge.js
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
    title: { 
      type: String, 
      required: [true, 'Title is required'] 
    },
    funding: { 
      type: String, 
      required: [true, 'Funding is required'] 
    },
    deadline: { 
      type: Date, 
      required: [true, 'Deadline is required'] 
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'] 
    },
    visible: { 
      type: Boolean, 
      default: true 
    },
    image: { 
      type: String 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Challenge", challengeSchema);
