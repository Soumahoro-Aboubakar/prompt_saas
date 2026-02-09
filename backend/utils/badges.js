// Badge definitions with conditions for earning them
const BADGE_DEFINITIONS = [
    // Progression badges
    {
        id: 'first_step',
        name: 'Premier Pas',
        icon: 'solar:rocket-linear',
        gradient: 'from-amber-400 to-orange-500',
        shadow: 'shadow-amber-500/20',
        description: 'Compléter votre premier module',
        condition: (stats) => stats.modulesCompleted >= 1
    },
    {
        id: 'apprentice',
        name: 'Apprenti',
        icon: 'solar:book-linear',
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'shadow-emerald-500/20',
        description: 'Compléter 3 modules',
        condition: (stats) => stats.modulesCompleted >= 3
    },
    {
        id: 'scholar',
        name: 'Érudit',
        icon: 'solar:graduation-cap-linear',
        gradient: 'from-blue-400 to-indigo-500',
        shadow: 'shadow-blue-500/20',
        description: 'Compléter 5 modules',
        condition: (stats) => stats.modulesCompleted >= 5
    },
    {
        id: 'master',
        name: 'Maître',
        icon: 'solar:diploma-linear',
        gradient: 'from-violet-400 to-purple-500',
        shadow: 'shadow-violet-500/20',
        description: 'Compléter 10 modules',
        condition: (stats) => stats.modulesCompleted >= 10
    },

    // Streak badges
    {
        id: 'streak_3',
        name: 'Régulier',
        icon: 'solar:fire-linear',
        gradient: 'from-orange-400 to-red-500',
        shadow: 'shadow-orange-500/20',
        description: 'Maintenir une série de 3 jours',
        condition: (stats) => stats.streak >= 3 || stats.longestStreak >= 3
    },
    {
        id: 'streak_7',
        name: 'Dévoué',
        icon: 'solar:flame-linear',
        gradient: 'from-red-400 to-rose-500',
        shadow: 'shadow-red-500/20',
        description: 'Maintenir une série de 7 jours',
        condition: (stats) => stats.streak >= 7 || stats.longestStreak >= 7
    },

    // XP badges
    {
        id: 'xp_500',
        name: 'Collectionneur',
        icon: 'solar:star-linear',
        gradient: 'from-yellow-400 to-amber-500',
        shadow: 'shadow-yellow-500/20',
        description: 'Atteindre 500 XP',
        condition: (stats) => stats.totalXP >= 500
    },
    {
        id: 'xp_1000',
        name: 'Expert',
        icon: 'solar:stars-linear',
        gradient: 'from-cyan-400 to-blue-500',
        shadow: 'shadow-cyan-500/20',
        description: 'Atteindre 1000 XP',
        condition: (stats) => stats.totalXP >= 1000
    },
    {
        id: 'xp_2500',
        name: 'Légende',
        icon: 'solar:crown-linear',
        gradient: 'from-purple-400 to-pink-500',
        shadow: 'shadow-purple-500/20',
        description: 'Atteindre 2500 XP',
        condition: (stats) => stats.totalXP >= 2500
    },

    // Level badges
    {
        id: 'level_5',
        name: 'Niveau 5',
        icon: 'solar:chart-2-linear',
        gradient: 'from-green-400 to-emerald-500',
        shadow: 'shadow-green-500/20',
        description: 'Atteindre le niveau 5',
        condition: (stats) => stats.level >= 5
    },
    {
        id: 'level_10',
        name: 'Niveau 10',
        icon: 'solar:ranking-linear',
        gradient: 'from-indigo-400 to-violet-500',
        shadow: 'shadow-indigo-500/20',
        description: 'Atteindre le niveau 10',
        condition: (stats) => stats.level >= 10
    }
];

// Get all badge definitions (without condition functions for client)
const getBadgeDefinitions = () => {
    return BADGE_DEFINITIONS.map(({ id, name, icon, gradient, shadow, description }) => ({
        id, name, icon, gradient, shadow, description
    }));
};

// Check and award new badges based on current stats
const checkAndAwardBadges = async (stats) => {
    const newBadges = [];
    const earnedBadgeIds = stats.badges.map(b => b.id);

    for (const badge of BADGE_DEFINITIONS) {
        // Skip if already earned
        if (earnedBadgeIds.includes(badge.id)) continue;

        // Check if condition is met
        if (badge.condition(stats)) {
            const newBadge = {
                id: badge.id,
                name: badge.name,
                icon: badge.icon,
                gradient: badge.gradient,
                shadow: badge.shadow,
                earnedAt: new Date()
            };
            stats.badges.push(newBadge);
            newBadges.push(newBadge);
        }
    }

    if (newBadges.length > 0) {
        await stats.save();
    }

    return newBadges;
};

// Get locked badges (badges not yet earned)
const getLockedBadges = (earnedBadgeIds) => {
    return BADGE_DEFINITIONS
        .filter(badge => !earnedBadgeIds.includes(badge.id))
        .map(({ id, name, icon, gradient, shadow, description }) => ({
            id, name, icon, gradient, shadow, description, isLocked: true
        }));
};

module.exports = {
    BADGE_DEFINITIONS,
    getBadgeDefinitions,
    checkAndAwardBadges,
    getLockedBadges
};
