const mongoose = require("mongoose");

const completerSchema = new mongoose.Schema({
    projectName: { 
        type: String, 
        required: true 
    },
    profile: { 
        type: String, 
        required: true 
    },
    position: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    funding: { 
        type: String, 
        required: true 
    },
    linkedinUrl: { 
        type: String, 
        required: true 
    },
    profilePicture: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'],
        default: 'active'
    },
    visible: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Completer", completerSchema);