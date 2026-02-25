const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminMiddleware');

/**
 * GET /api/suggestions
 * List all suggestions with filtering and sorting.
 * Query: status, sort (popular|recent), page, limit
 */
router.get('/', protect, async (req, res) => {
    try {
        const { status, sort = 'recent', page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const sortOption = sort === 'popular'
            ? { voteCount: -1, createdAt: -1 }
            : { createdAt: -1 };

        const total = await Suggestion.countDocuments(filter);
        const suggestions = await Suggestion.find(filter)
            .sort(sortOption)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .populate('author', 'fullName avatar')
            .populate('adminRespondedBy', 'fullName')
            .lean();

        // Add `hasVoted` flag for the current user
        const userId = req.user._id.toString();
        const enriched = suggestions.map(s => ({
            ...s,
            hasVoted: s.votes.some(v => v.toString() === userId)
        }));

        res.json({
            success: true,
            data: enriched,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        console.error('GET /suggestions error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch suggestions' });
    }
});

/**
 * GET /api/suggestions/mine
 * Get the current user's suggestions.
 */
router.get('/mine', protect, async (req, res) => {
    try {
        const suggestions = await Suggestion.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .populate('author', 'fullName avatar')
            .populate('adminRespondedBy', 'fullName')
            .lean();

        const userId = req.user._id.toString();
        const enriched = suggestions.map(s => ({
            ...s,
            hasVoted: s.votes.some(v => v.toString() === userId)
        }));

        res.json({ success: true, data: enriched });
    } catch (err) {
        console.error('GET /suggestions/mine error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch your suggestions' });
    }
});

/**
 * POST /api/suggestions
 * Create a new suggestion.
 */
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and category are required'
            });
        }

        const suggestion = await Suggestion.create({
            title: title.trim(),
            description: description.trim(),
            category,
            author: req.user._id
        });

        const populated = await Suggestion.findById(suggestion._id)
            .populate('author', 'fullName avatar')
            .lean();

        res.status(201).json({
            success: true,
            data: { ...populated, hasVoted: false }
        });
    } catch (err) {
        console.error('POST /suggestions error:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Failed to create suggestion' });
    }
});

/**
 * POST /api/suggestions/:id/vote
 * Toggle vote on a suggestion (add/remove).
 */
router.post('/:id/vote', protect, async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);
        if (!suggestion) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }

        const userId = req.user._id;
        const alreadyVoted = suggestion.votes.some(v => v.toString() === userId.toString());

        if (alreadyVoted) {
            suggestion.votes = suggestion.votes.filter(v => v.toString() !== userId.toString());
            suggestion.voteCount = Math.max(0, suggestion.voteCount - 1);
        } else {
            suggestion.votes.push(userId);
            suggestion.voteCount += 1;
        }

        await suggestion.save();

        res.json({
            success: true,
            data: {
                voteCount: suggestion.voteCount,
                hasVoted: !alreadyVoted
            }
        });
    } catch (err) {
        console.error('POST /suggestions/:id/vote error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to toggle vote' });
    }
});

/**
 * PATCH /api/suggestions/:id/status
 * Admin: update suggestion status.
 */
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'in_review', 'in_progress', 'implemented', 'declined'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const suggestion = await Suggestion.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate('author', 'fullName avatar')
            .populate('adminRespondedBy', 'fullName');

        if (!suggestion) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }

        res.json({ success: true, data: suggestion });
    } catch (err) {
        console.error('PATCH /suggestions/:id/status error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
});

/**
 * PATCH /api/suggestions/:id/respond
 * Admin: add a response to a suggestion.
 */
router.patch('/:id/respond', protect, adminOnly, async (req, res) => {
    try {
        const { response } = req.body;

        if (!response || !response.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Response text is required'
            });
        }

        const suggestion = await Suggestion.findByIdAndUpdate(
            req.params.id,
            {
                adminResponse: response.trim(),
                adminRespondedBy: req.user._id,
                adminRespondedAt: new Date()
            },
            { new: true }
        )
            .populate('author', 'fullName avatar')
            .populate('adminRespondedBy', 'fullName');

        if (!suggestion) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }

        res.json({ success: true, data: suggestion });
    } catch (err) {
        console.error('PATCH /suggestions/:id/respond error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to respond to suggestion' });
    }
});

/**
 * DELETE /api/suggestions/:id
 * Delete a suggestion (own or admin).
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);

        if (!suggestion) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }

        // Only the author or an admin can delete
        const isOwner = suggestion.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this suggestion'
            });
        }

        await Suggestion.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Suggestion deleted' });
    } catch (err) {
        console.error('DELETE /suggestions/:id error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to delete suggestion' });
    }
});

module.exports = router;
