const express = require('express');
const router = express.Router();
const multer = require('multer');
const Template = require('../models/Template');
const TemplateCategory = require('../models/TemplateCategory');
const TemplateType = require('../models/TemplateType');
const { protect, admin } = require('../middleware/auth');
const storageService = require('../services/storageService');
const { normalizeTypeKey } = require('../config/storeTemplateTypes');
const { ensureSystemTemplateTypes } = require('../utils/templateTypes');

// Multer Config (Memory Storage for pushing buffer to S3 directly)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
});

// Protect all routes in this file
router.use(protect, admin);


// ==========================================
// TEMPLATES
// ==========================================

/**
 * GET /api/admin/store/templates
 * List ALL templates (draft + published) with admin filters
 */
router.get('/templates', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const {
            status,
            type,
            category,
            search,
            sort = 'createdAt',
            page = 1,
            limit = 50
        } = req.query;

        const query = {};

        if (status) query.status = status;
        if (type) query.type = type;
        if (category) {
            const catDoc = await TemplateCategory.findOne({ slug: category });
            if (catDoc) query.category = catDoc._id;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const pageNum = parseInt(page, 10);
        const limitNum = Math.min(parseInt(limit, 10), 200);
        const startIndex = (pageNum - 1) * limitNum;

        const sortMap = {
            createdAt: { createdAt: -1 },
            title: { title: 1 },
            copies: { copies: -1 },
            views: { views: -1 },
        };
        const sortObj = sortMap[sort] || { createdAt: -1 };

        const total = await Template.countDocuments(query);
        const templates = await Template.find(query)
            .sort(sortObj)
            .skip(startIndex)
            .limit(limitNum)
            .populate('category', 'label slug');

        res.json({
            success: true,
            count: templates.length,
            pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
            data: templates
        });
    } catch (error) {
        console.error('Admin get templates error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/admin/store/templates
 * Create a new template (Draft or Published)
 */
router.post('/templates', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const typeKey = normalizeTypeKey(req.body.type || '');
        const typeDoc = await TemplateType.findOne({ key: typeKey });
        if (!typeDoc) {
            return res.status(400).json({ success: false, message: 'Template type does not exist' });
        }

        const payload = { ...req.body, type: typeKey };
        const template = await Template.create(payload);
        res.status(201).json({ success: true, data: template });
    } catch (error) {
        console.error('Create template error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

/**
 * PUT /api/admin/store/templates/:id
 * Update an existing template
 */
router.put('/templates/:id', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        if (req.body.type) {
            const typeKey = normalizeTypeKey(req.body.type);
            const typeDoc = await TemplateType.findOne({ key: typeKey });
            if (!typeDoc) {
                return res.status(400).json({ success: false, message: 'Template type does not exist' });
            }
            req.body.type = typeKey;
        }

        const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        res.json({ success: true, data: template });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/admin/store/templates/:id
 * Delete a template
 */
router.delete('/templates/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        // Delete image from cloud storage if thumbnailUrl exists and is a stored file
        if (template.thumbnailUrl && storageService.client) {
            try {
                // Extract key from URL – works if URL contains bucket name in path
                const url = new URL(template.thumbnailUrl);
                const parts = url.pathname.split('/').filter(Boolean);
                // Key is everything after the bucket name in the path
                const bucketIdx = parts.indexOf(storageService.bucketName);
                if (bucketIdx >= 0) {
                    const fileKey = parts.slice(bucketIdx + 1).join('/');
                    if (fileKey) await storageService.deleteFile(fileKey).catch(() => { });
                }
            } catch (_) { }
        }

        await template.deleteOne();
        res.json({ success: true, message: 'Template removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/admin/store/upload
 * Upload an image to cloud storage (R2/B2)
 */
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        const url = await storageService.uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            'store-templates'
        );

        res.json({
            success: true,
            url: url,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
});


// ==========================================
// TEMPLATE TYPES
// ==========================================

/**
 * GET /api/admin/store/types
 * List all template types (system + custom)
 */
router.get('/types', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const types = await TemplateType.find().sort('order');
        res.json({ success: true, data: types });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/admin/store/types
 * Create a new custom template type
 */
router.post('/types', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const key = normalizeTypeKey(req.body.key || req.body.label || '');
        if (!key) {
            return res.status(400).json({ success: false, message: 'Type key is required' });
        }

        const existing = await TemplateType.findOne({ key });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Template type key already exists' });
        }

        const created = await TemplateType.create({
            key,
            label: req.body.label || key,
            description: req.body.description || '',
            icon: req.body.icon || 'solar:widget-linear',
            capabilities: Array.isArray(req.body.capabilities) ? req.body.capabilities : [],
            isSystem: false,
            isActive: req.body.isActive !== false,
            order: Number.isFinite(req.body.order) ? req.body.order : 100
        });

        res.status(201).json({ success: true, data: created });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/**
 * PUT /api/admin/store/types/:id
 * Update template type metadata (system key cannot be changed)
 */
router.put('/types/:id', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const typeDoc = await TemplateType.findById(req.params.id);
        if (!typeDoc) {
            return res.status(404).json({ success: false, message: 'Template type not found' });
        }

        if (!typeDoc.isSystem && req.body.key) {
            typeDoc.key = normalizeTypeKey(req.body.key);
        }
        if (req.body.label !== undefined) typeDoc.label = req.body.label;
        if (req.body.description !== undefined) typeDoc.description = req.body.description;
        if (req.body.icon !== undefined) typeDoc.icon = req.body.icon;
        if (Array.isArray(req.body.capabilities)) typeDoc.capabilities = req.body.capabilities;
        if (req.body.isActive !== undefined) typeDoc.isActive = !!req.body.isActive;
        if (req.body.order !== undefined) typeDoc.order = Number(req.body.order) || 0;

        await typeDoc.save();
        res.json({ success: true, data: typeDoc });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/admin/store/types/:id
 * Remove a custom type if unused
 */
router.delete('/types/:id', async (req, res) => {
    try {
        await ensureSystemTemplateTypes();
        const typeDoc = await TemplateType.findById(req.params.id);
        if (!typeDoc) {
            return res.status(404).json({ success: false, message: 'Template type not found' });
        }
        if (typeDoc.isSystem) {
            return res.status(400).json({ success: false, message: 'System template types cannot be deleted' });
        }

        const usageCount = await Template.countDocuments({ type: typeDoc.key });
        if (usageCount > 0) {
            return res.status(400).json({ success: false, message: 'Type is used by templates. Disable it instead.' });
        }

        await typeDoc.deleteOne();
        res.json({ success: true, message: 'Template type removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// CATEGORIES
// ==========================================

/**
 * GET /api/admin/store/categories
 * List all categories (including inactive)
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await TemplateCategory.find().sort('order');
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * POST /api/admin/store/categories
 * Create a new category
 */
router.post('/categories', async (req, res) => {
    try {
        const category = await TemplateCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/**
 * PUT /api/admin/store/categories/:id
 * Update category
 */
router.put('/categories/:id', async (req, res) => {
    try {
        const category = await TemplateCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/admin/store/categories/:id
 * Delete category
 */
router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await TemplateCategory.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.json({ success: true, message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
