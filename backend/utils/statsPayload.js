const buildStatsPayload = (stats, options = {}) => {
    const {
        lockedBadges = [],
        newBadges = []
    } = options;

    if (!stats) return null;

    return {
        totalXP: stats.totalXP,
        level: stats.level,
        streak: stats.streak,
        longestStreak: stats.longestStreak,
        modulesCompleted: stats.modulesCompleted,
        badges: stats.badges,
        lockedBadges,
        newBadges,
        lastActivityDate: stats.lastActivityDate,
        weeklyActivity: stats.getWeeklyActivityForDisplay(),
        streakStatus: {
            isActiveToday: stats.isActiveToday(),
            isAtRisk: stats.isStreakAtRisk(),
            daysSinceLastActivity: stats.getDaysSinceLastActivity()
        }
    };
};

module.exports = {
    buildStatsPayload
};
