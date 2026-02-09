const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const { protect } = require('../middleware/auth');
const { checkAndAwardBadges, getLockedBadges, getBadgeDefinitions } = require('../utils/badges');

// @desc    Get user statistics
// @route   GET /api/stats
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let stats = await UserStats.findOne({ user: req.user._id });

        if (!stats) {
            // Create default stats if not exists
            stats = await UserStats.create({
                user: req.user._id,
                totalXP: 0,
                level: 1,
                streak: 0
            });
        }

        // Check for new badges automatically
        const newBadges = await checkAndAwardBadges(stats);

        // Get locked badges for display
        const earnedBadgeIds = stats.badges.map(b => b.id);
        const lockedBadges = getLockedBadges(earnedBadgeIds);

        res.json({
            success: true,
            stats: {
                totalXP: stats.totalXP,
                level: stats.level,
                streak: stats.streak,
                longestStreak: stats.longestStreak,
                modulesCompleted: stats.modulesCompleted,
                badges: stats.badges,
                lockedBadges: lockedBadges.slice(0, 3), // Show max 3 locked badges
                newBadges: newBadges, // Newly earned badges this check
                lastActivityDate: stats.lastActivityDate,
                weeklyActivity: stats.getWeeklyActivityForDisplay()
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
});

// @desc    Add XP to user
// @route   PUT /api/stats/xp
// @access  Private
router.put('/xp', protect, async (req, res) => {
    try {
        const { amount, reason } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid XP amount'
            });
        }

        let stats = await UserStats.findOne({ user: req.user._id });

        if (!stats) {
            stats = await UserStats.create({
                user: req.user._id,
                totalXP: 0,
                level: 1
            });
        }

        const previousLevel = stats.level;
        await stats.addXP(amount);

        const leveledUp = stats.level > previousLevel;

        res.json({
            success: true,
            xpAdded: amount,
            reason: reason || 'XP earned',
            stats: {
                totalXP: stats.totalXP,
                level: stats.level,
                streak: stats.streak,
                leveledUp,
                previousLevel: leveledUp ? previousLevel : undefined
            }
        });
    } catch (error) {
        console.error('Add XP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding XP'
        });
    }
});

// @desc    Add badge to user
// @route   POST /api/stats/badges
// @access  Private
router.post('/badges', protect, async (req, res) => {
    try {
        const { badgeId, badgeName, badgeIcon } = req.body;

        if (!badgeId || !badgeName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide badge id and name'
            });
        }

        let stats = await UserStats.findOne({ user: req.user._id });

        if (!stats) {
            stats = await UserStats.create({
                user: req.user._id,
                totalXP: 0,
                level: 1
            });
        }

        // Check if badge already exists
        const badgeExists = stats.badges.some(b => b.id === badgeId);
        if (badgeExists) {
            return res.status(400).json({
                success: false,
                message: 'Badge already earned'
            });
        }

        // Add badge
        stats.badges.push({
            id: badgeId,
            name: badgeName,
            icon: badgeIcon || 'solar:medal-ribbons-star-linear',
            earnedAt: new Date()
        });

        await stats.save();

        res.json({
            success: true,
            badge: stats.badges[stats.badges.length - 1],
            totalBadges: stats.badges.length
        });
    } catch (error) {
        console.error('Add badge error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding badge'
        });
    }
});

// @desc    Get leaderboard
// @route   GET /api/stats/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const leaderboard = await UserStats.find()
            .sort({ totalXP: -1 })
            .limit(limit)
            .populate('user', 'fullName');

        res.json({
            success: true,
            leaderboard: leaderboard.map((entry, index) => ({
                rank: index + 1,
                userId: entry.user?._id,
                name: entry.user?.fullName || 'Anonymous',
                totalXP: entry.totalXP,
                level: entry.level,
                badges: entry.badges.length
            }))
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard'
        });
    }
});

module.exports = router;
