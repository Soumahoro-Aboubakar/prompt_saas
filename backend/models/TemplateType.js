const mongoose = require('mongoose');

const templateTypeSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [60, 'Key cannot be more than 60 characters']
    },
    label: {
        type: String,
        required: true,
        trim: true,
        maxlength: [80, 'Label cannot be more than 80 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [220, 'Description cannot be more than 220 characters'],
        default: ''
    },
    icon: {
        type: String,
        trim: true,
        default: 'solar:widget-linear'
    },
    capabilities: {
        type: [String],
        default: []
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TemplateType', templateTypeSchema);
