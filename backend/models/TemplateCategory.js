const mongoose = require('mongoose');

const templateCategorySchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, 'Please add a category label'],
        trim: true,
        maxlength: [50, 'Label cannot be more than 50 characters']
    },
    slug: {
        type: String,
        required: [true, 'Please add a category slug'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [50, 'Slug cannot be more than 50 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot be more than 200 characters'],
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TemplateCategory', templateCategorySchema);
