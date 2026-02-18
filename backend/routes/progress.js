const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const UserStats = require('../models/UserStats');
const { protect } = require('../middleware/auth');
const { checkAndAwardBadges, getLockedBadges } = require('../utils/badges');
const { buildStatsPayload } = require('../utils/statsPayload');

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
        if (!Number.isInteger(moduleId) || moduleId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid module id'
            });
        }

        const { completed, score, timeSpent, xpEarned } = req.body;
        const normalizedScore = Number(score);
        const normalizedTimeSpent = Number(timeSpent);
        const normalizedXpEarned = Number(xpEarned) || 0;
        const isCompleting = Boolean(completed);
        let stats = await UserStats.findOne({ user: req.user._id });

        // Find or create progress
        let progress = await UserProgress.findOne({
            user: req.user._id,
            moduleId
        });

        const wasAlreadyCompleted = Boolean(progress?.completed);
        const isNewCompletion = !wasAlreadyCompleted && isCompleting;

        if (progress) {
            // Update existing progress
            progress.attempts += 1;
            progress.lastAttemptAt = new Date();

            if (Number.isFinite(normalizedScore) && normalizedScore > progress.score) {
                progress.score = normalizedScore;
            }
            if (Number.isFinite(normalizedTimeSpent) && normalizedTimeSpent > 0) {
                progress.timeSpent += normalizedTimeSpent;
            }
            if (isCompleting && !progress.completed) {
                progress.completed = true;
                progress.completedAt = new Date();
            }

            await progress.save();
        } else {
            // Create new progress
            progress = await UserProgress.create({
                user: req.user._id,
                moduleId,
                completed: isCompleting,
                score: Number.isFinite(normalizedScore) ? normalizedScore : 0,
                timeSpent: Number.isFinite(normalizedTimeSpent) ? normalizedTimeSpent : 0,
                attempts: 1,
                lastAttemptAt: new Date(),
                completedAt: isCompleting ? new Date() : null
            });
        }

        // Reward and activity are applied on first completion only (idempotent).
        if (isNewCompletion) {
            if (!stats) {
                stats = await UserStats.create({
                    user: req.user._id,
                    totalXP: 0,
                    level: 1
                });
            }

            stats.modulesCompleted += 1;

            if (normalizedXpEarned > 0) {
                await stats.addXP(normalizedXpEarned, {
                    moduleCompleted: true,
                    save: false
                });
            } else {
                stats.recordActivity({
                    xpEarned: 0,
                    moduleCompleted: true
                });
            }

            await stats.save();
            const newBadges = await checkAndAwardBadges(stats);

            const earnedBadgeIds = stats.badges.map(b => b.id);
            const lockedBadges = getLockedBadges(earnedBadgeIds).slice(0, 3);

            return res.json({
                success: true,
                progress: {
                    moduleId: progress.moduleId,
                    completed: progress.completed,
                    score: progress.score,
                    timeSpent: progress.timeSpent,
                    attempts: progress.attempts,
                    completedAt: progress.completedAt
                },
                stats: buildStatsPayload(stats, {
                    lockedBadges,
                    newBadges
                }),
                isNewCompletion: true
            });
        }

        if (!stats) {
            stats = await UserStats.create({
                user: req.user._id,
                totalXP: 0,
                level: 1,
                streak: 0
            });
        }

        // Keep streak state fresh even when a module was already completed.
        const streakReset = stats.resetStreakIfExpired();
        if (streakReset) {
            await stats.save();
        }

        const newBadges = await checkAndAwardBadges(stats);
        const earnedBadgeIds = stats.badges.map((b) => b.id);
        const lockedBadges = getLockedBadges(earnedBadgeIds).slice(0, 3);

        res.json({
            success: true,
            progress: {
                moduleId: progress.moduleId,
                completed: progress.completed,
                score: progress.score,
                timeSpent: progress.timeSpent,
                attempts: progress.attempts,
                completedAt: progress.completedAt
            },
            stats: buildStatsPayload(stats, {
                lockedBadges,
                newBadges
            }),
            isNewCompletion: false
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
