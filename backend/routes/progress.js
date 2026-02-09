const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const UserStats = require('../models/UserStats');
const { protect } = require('../middleware/auth');

// @desc    Get all progress for current user
// @route   GET /api/progress
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const progress = await UserProgress.find({ user: req.user._id })
            .sort({ moduleId: 1 });

        res.json({
            success: true,
            count: progress.length,
            progress: progress.map(p => ({
                moduleId: p.moduleId,
                completed: p.completed,
                score: p.score,
                timeSpent: p.timeSpent,
                attempts: p.attempts,
                completedAt: p.completedAt
            }))
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress'
        });
    }
});

// @desc    Get progress for specific module
// @route   GET /api/progress/:moduleId
// @access  Private
router.get('/:moduleId', protect, async (req, res) => {
    try {
        const moduleId = parseInt(req.params.moduleId);

        const progress = await UserProgress.findOne({
            user: req.user._id,
            moduleId
        });

        if (!progress) {
            return res.json({
                success: true,
                progress: {
                    moduleId,
                    completed: false,
                    score: 0,
                    timeSpent: 0,
                    attempts: 0
                }
            });
        }

        res.json({
            success: true,
            progress: {
                moduleId: progress.moduleId,
                completed: progress.completed,
                score: progress.score,
                timeSpent: progress.timeSpent,
                attempts: progress.attempts,
                completedAt: progress.completedAt
            }
        });
    } catch (error) {
        console.error('Get module progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching module progress'
        });
    }
});

// @desc    Update/Complete module progress
// @route   POST /api/progress/:moduleId
// @access  Private
router.post('/:moduleId', protect, async (req, res) => {
    try {
        const moduleId = parseInt(req.params.moduleId);
        const { completed, score, timeSpent, xpEarned } = req.body;

        // Find or create progress
        let progress = await UserProgress.findOne({
            user: req.user._id,
            moduleId
        });

        const isNewCompletion = !progress?.completed && completed;

        if (progress) {
            // Update existing progress
            progress.attempts += 1;
            progress.lastAttemptAt = new Date();

            if (score !== undefined && score > progress.score) {
                progress.score = score;
            }
            if (timeSpent) {
                progress.timeSpent += timeSpent;
            }
            if (completed && !progress.completed) {
                progress.completed = true;
                progress.completedAt = new Date();
            }

            await progress.save();
        } else {
            // Create new progress
            progress = await UserProgress.create({
                user: req.user._id,
                moduleId,
                completed: completed || false,
                score: score || 0,
                timeSpent: timeSpent || 0,
                attempts: 1,
                lastAttemptAt: new Date(),
                completedAt: completed ? new Date() : null
            });
        }

        // Update user stats if XP earned
        if (xpEarned && xpEarned > 0) {
            let stats = await UserStats.findOne({ user: req.user._id });

            if (!stats) {
                stats = await UserStats.create({
                    user: req.user._id,
                    totalXP: 0,
                    level: 1
                });
            }

            await stats.addXP(xpEarned);

            // Update modules completed count if new completion
            if (isNewCompletion) {
                stats.modulesCompleted += 1;
                await stats.save();
            }
        }

        res.json({
            success: true,
            progress: {
                moduleId: progress.moduleId,
                completed: progress.completed,
                score: progress.score,
                timeSpent: progress.timeSpent,
                attempts: progress.attempts,
                completedAt: progress.completedAt
            }
        });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating progress'
        });
    }
});

module.exports = router;
