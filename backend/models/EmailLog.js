const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Automatically delete documents after 24 hours (86400 seconds)
    }
});

module.exports = mongoose.model("EmailLog", emailLogSchema);
