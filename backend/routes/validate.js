const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateAnswer, getProvider, isApiKeyConfigured, getApiKeyLabel } = require('../services/aiService');

// POST /api/validate — AI-powered answer validation
router.post('/', protect, async (req, res) => {
    try {
        const { moduleId, userAnswer, exercise, moduleTitle } = req.body;

        // Validate required fields
        if (!userAnswer || !exercise) {
            return res.status(400).json({
                success: false,
                message: 'userAnswer and exercise are required'
            });
        }

        if (!userAnswer.trim()) {
            return res.status(400).json({
                success: false,
                message: 'userAnswer cannot be empty'
            });
        }

        // Check API key is configured for the active provider
        if (!isApiKeyConfigured()) {
            return res.status(500).json({
                success: false,
                message: `${getProvider().toUpperCase()} API key not configured (${getApiKeyLabel()})`
            });
        }

        const result = await validateAnswer(exercise, userAnswer, moduleTitle || '');

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Validate route error:', error.message);

        // Handle API-specific errors
        if (error.status === 401 || error.code === 'invalid_api_key') {
            return res.status(500).json({
                success: false,
                message: `Invalid ${getProvider().toUpperCase()} API key`
            });
        }

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit exceeded, please try again later'
            });
        }

        res.status(500).json({
            success: false,
            message: 'AI validation failed, please try again'
        });
    }
});

module.exports = router;
