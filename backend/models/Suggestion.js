const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: ['feature', 'improvement', 'optimization'],
            message: 'Category must be feature, improvement, or optimization'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in_review', 'in_progress', 'implemented', 'declined'],
        default: 'pending'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    voteCount: {
        type: Number,
        default: 0
    },
    adminResponse: {
        type: String,
        trim: true,
        maxlength: [1000, 'Admin response cannot exceed 1000 characters']
    },
    adminRespondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    adminRespondedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
suggestionSchema.index({ voteCount: -1 });
suggestionSchema.index({ status: 1 });
suggestionSchema.index({ author: 1 });
suggestionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Suggestion', suggestionSchema);
