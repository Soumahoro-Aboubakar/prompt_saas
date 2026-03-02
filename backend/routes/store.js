const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const TemplateCategory = require('../models/TemplateCategory');
const TemplateType = require('../models/TemplateType');
const { ensureSystemTemplateTypes } = require('../utils/templateTypes');

/**
 * GET /api/store-pro
 * Returns published templates with rich filtering, search, and pagination
 */
router.get('/', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const {
            category,
            type,
            search,
            complexity,
            aiModel,
            tags,
            subtype,
            projectType,
            theme,
            style,
            designTool,
            textCategory,
            imageType,
            artCategory,
            ratio,
            webCategory,
            libraries,
            targetProjectType,
            model,
            sort = 'recent', // recent, popular, trending
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        const query = { status: 'published' };

        // 1. Text Search
        if (search) {
            query.$text = { $search: search };
        }

        // 2. Exact Match Filters
        if (type) query.type = type;
        if (complexity) query.complexity = complexity;
        if (aiModel || model) query.aiModel = aiModel || model;

        // 3. Category Filter
        if (category && category !== 'all') {
            const catDoc = await TemplateCategory.findOne({ slug: category });
            if (catDoc) {
                query.category = catDoc._id;
            }
        }

        // 4. Tags Filter (Array Match)
        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim());
            query.tags = { $in: tagArray };
        }

        // 5. Type-specific Metadata Filters
        if (subtype) query['metadata.webSubtype'] = subtype;
        if (projectType || targetProjectType) query['metadata.projectType'] = projectType || targetProjectType;
        if (theme) query['metadata.webTheme'] = theme;
        if (style) {
            // Could be artStyle (image) or designStyle (ui_design)
            query.$or = [
                { 'metadata.artStyle': { $regex: style, $options: 'i' } },
                { 'metadata.designStyle': { $regex: style, $options: 'i' } }
            ];
        }
        if (designTool) query['metadata.designTool'] = designTool;
        if (textCategory) query['metadata.textCategory'] = textCategory;
        if (imageType) query['metadata.imageType'] = imageType;
        if (artCategory) query['metadata.artCategory'] = artCategory;
        if (ratio) query['metadata.ratio'] = ratio;
        if (webCategory) query['metadata.webCategory'] = webCategory;

        if (libraries) {
            const libArray = libraries.split(',').map((l) => l.trim()).filter(Boolean);
            if (libArray.length > 0) {
                query['metadata.libraries'] = { $in: libArray };
            }
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = Math.min(parseInt(limit, 10), 50); // Cap at 50
        const startIndex = (pageNum - 1) * limitNum;

        // Sorting
        let sortObj = { createdAt: -1 }; // Default: Recent
        if (search) {
            sortObj = { score: { $meta: 'textScore' } }; // Best match if searching
        } else if (sort === 'popular') {
            sortObj = { copies: -1, views: -1 };
        } else if (sort === 'trending') {
            // Trending: weighted by copies + views (simple proxy for now)
            // For a real trending algo, we'd use a time-weighted score
            sortObj = { copies: -1, views: -1, createdAt: -1 };
        }

        // Execute Query
        const total = await Template.countDocuments(query);
        const templates = await Template.find(query)
            .sort(sortObj)
            .skip(startIndex)
            .limit(limitNum)
            .populate('category', 'label slug');
        const typeKeys = [...new Set(templates.map((tpl) => tpl.type).filter(Boolean))];
        const typeDocs = await TemplateType.find({ key: { $in: typeKeys } }).select('key label icon');
        const typeMap = new Map(typeDocs.map((typeDoc) => [typeDoc.key, typeDoc]));
        const data = templates.map((tpl) => {
            const typeDoc = typeMap.get(tpl.type);
            return {
                ...tpl.toObject(),
                typeLabel: typeDoc?.label || tpl.type,
                typeIcon: typeDoc?.icon || null
            };
        });

        res.json({
            success: true,
            count: data.length,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                hasMore: startIndex + data.length < total
            },
            data
        });
    } catch (err) {
        console.error('Store Pro GET route error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve templates',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

/**
 * GET /api/store-pro/types
 * Returns active template types (system + custom)
 */
router.get('/types', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const types = await TemplateType.find({ isActive: true }).sort('order');
        res.json({ success: true, data: types });
    } catch (err) {
        console.error('Store Pro types error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve template types' });
    }
});

/**
 * GET /api/store-pro/categories
 * Returns active categories ordered by `order` field
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await TemplateCategory.find({ isActive: true }).sort('order');
        res.json({ success: true, data: categories });
    } catch (err) {
        console.error('Store Pro categories error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
    }
});

/**
 * GET /api/store-pro/:id
 * Get single template by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id).populate('category', 'label slug');

        if (!template || template.status !== 'published') {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        // Increment views
        template.views += 1;
        await template.save();

        res.json({ success: true, data: template });
    } catch (err) {
        console.error('Store Pro single GET error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve template' });
    }
});

/**
 * POST /api/store-pro/:id/copy
 * Increment copy counter
 */
router.post('/:id/copy', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        template.copies += 1;
        await template.save();

        res.json({ success: true, message: 'Copy counted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to count copy' });
    }
});


module.exports = router;
