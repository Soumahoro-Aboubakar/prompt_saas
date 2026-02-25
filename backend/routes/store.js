const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load the static prompts data once at startup
const DATA_PATH = path.join(__dirname, '../data/storeProData.json');
let promptsData = [];

try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    promptsData = JSON.parse(raw);
} catch (err) {
    console.error('Failed to load storeProData.json:', err.message);
}

/**
 * GET /api/store-pro
 * Returns all prompts, optionally filtered by categorySlug
 * Query params:
 *   - category (string): filter by categorySlug
 */
router.get('/', (req, res) => {
    try {
        const { category } = req.query;

        let results = promptsData;

        if (category && category !== 'all') {
            results = promptsData.filter(
                (p) => p.categorySlug === category
            );
        }

        res.json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (err) {
        console.error('Store Pro route error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve prompts',
        });
    }
});

/**
 * GET /api/store-pro/categories
 * Returns the list of unique categories
 */
router.get('/categories', (req, res) => {
    try {
        const seen = new Set();
        const categories = [];

        for (const p of promptsData) {
            if (!seen.has(p.categorySlug)) {
                seen.add(p.categorySlug);
                categories.push({
                    slug: p.categorySlug,
                    label: p.category,
                });
            }
        }

        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
    }
});

module.exports = router;
