const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a template title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    type: {
        type: String,
        required: [true, 'Please specify the template type'],
        trim: true,
        lowercase: true,
        maxlength: [60, 'Type cannot be more than 60 characters']
    },
    category: {
        type: String,
        ref: 'TemplateCategory',
        required: [true, 'Please specify a category slug']
    },
    prompt: {
        type: String,
        required: [true, 'Please provide the template prompt content']
    },
    tags: {
        type: [String],
        index: true
    },
    indexedTerms: {
        type: [String],
        index: true,
        default: []
    },
    complexity: {
        type: String,
        enum: ['simple', 'intermédiaire', 'avancé'],
        default: 'simple'
    },
    aiModel: {
        type: String,
        trim: true,
        default: ''
    },
    thumbnailUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    copies: {
        type: Number,
        default: 0
    },

    // Type-specific flexible metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for robust filtering and search
templateSchema.index({ title: 'text', description: 'text', prompt: 'text', tags: 'text', indexedTerms: 'text' });
templateSchema.index({ type: 1, category: 1, status: 1 });
templateSchema.index({ copies: -1, views: -1 }); // For "Popularity / Trends" filtering
templateSchema.index({ status: 1, type: 1, createdAt: -1 });
templateSchema.index({ 'metadata.projectType': 1, 'metadata.webSubtype': 1, 'metadata.webTheme': 1 });
templateSchema.index({ 'metadata.designTool': 1, 'metadata.designStyle': 1 });
templateSchema.index({ 'metadata.imageType': 1, 'metadata.artCategory': 1, 'metadata.artStyle': 1 });

const normalizeToken = (value) => {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

templateSchema.pre('save', function preSave(next) {
    const sourceTokens = [
        this.title,
        this.description,
        this.type,
        this.aiModel,
        ...(Array.isArray(this.tags) ? this.tags : []),
        ...(Array.isArray(this.metadata?.searchKeywords) ? this.metadata.searchKeywords : [])
    ].filter(Boolean);

    // Prepare deterministic tokens for full-text suggestions and lightweight indexing.
    const normalized = sourceTokens
        .map(normalizeToken)
        .filter(Boolean);

    this.indexedTerms = [...new Set(normalized)];
    this.tags = (this.tags || []).map(normalizeToken).filter(Boolean);
    next();
});

module.exports = mongoose.model('Template', templateSchema);
