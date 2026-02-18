const mongoose = require('mongoose');

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const toUtcDayStart = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
};

const userStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalXP: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    modulesCompleted: {
        type: Number,
        default: 0
    },
    badges: [{
        id: String,
        name: String,
        icon: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    weeklyActivity: [{
        date: Date,
        xpEarned: Number,
        modulesCompleted: Number
    }],
    lastActivityDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to calculate level from XP
userStatsSchema.methods.calculateLevel = function () {
    // Each level requires 200 XP
    // Level 1: 0-199 XP, Level 2: 200-399 XP, Level 3: 400-599, etc.
    const xp = this.totalXP;
    return Math.floor(xp / 200) + 1;
};

// Method to update weekly activity
userStatsSchema.methods.updateWeeklyActivity = function (xpEarned, modulesCompleted = 0, activityDate = new Date()) {
    const today = toUtcDayStart(activityDate);

    // Find today's entry
    const todayIndex = this.weeklyActivity.findIndex(entry => {
        const entryDate = toUtcDayStart(entry.date);
        return entryDate.getTime() === today.getTime();
    });

    if (todayIndex >= 0) {
        // Update existing entry
        this.weeklyActivity[todayIndex].xpEarned += xpEarned;
        this.weeklyActivity[todayIndex].modulesCompleted += modulesCompleted;
    } else {
        // Add new entry for today
        this.weeklyActivity.push({
            date: today,
            xpEarned: xpEarned,
            modulesCompleted: modulesCompleted
        });
    }

    // Keep only last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    this.weeklyActivity = this.weeklyActivity.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= sevenDaysAgo;
    });
};

userStatsSchema.methods.getDaysSinceLastActivity = function (referenceDate = new Date()) {
    if (!this.lastActivityDate) return Number.POSITIVE_INFINITY;

    const today = toUtcDayStart(referenceDate);
    const lastActivity = toUtcDayStart(this.lastActivityDate);
    return Math.floor((today.getTime() - lastActivity.getTime()) / DAY_IN_MS);
};

userStatsSchema.methods.isActiveToday = function (referenceDate = new Date()) {
    return this.getDaysSinceLastActivity(referenceDate) === 0;
};

userStatsSchema.methods.isStreakAtRisk = function (referenceDate = new Date()) {
    if (!this.streak || this.streak <= 0) return false;
    return this.getDaysSinceLastActivity(referenceDate) === 1;
};

// If the user missed more than one day, active streak is reset.
userStatsSchema.methods.resetStreakIfExpired = function (referenceDate = new Date()) {
    if (!this.streak || this.streak <= 0 || !this.lastActivityDate) return false;

    const diffDays = this.getDaysSinceLastActivity(referenceDate);
    if (diffDays > 1) {
        this.streak = 0;
        return true;
    }

    return false;
};

// Register activity (module completion/XP gain) and update streak + activity windows.
userStatsSchema.methods.recordActivity = function ({ xpEarned = 0, moduleCompleted = false, activityDate = new Date() } = {}) {
    const normalizedXP = Number(xpEarned) || 0;
    const today = toUtcDayStart(activityDate);

    let diffDays = Number.POSITIVE_INFINITY;
    if (this.lastActivityDate) {
        const lastActivity = toUtcDayStart(this.lastActivityDate);
        diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / DAY_IN_MS);
    }

    if (diffDays === Number.POSITIVE_INFINITY) {
        this.streak = 1;
    } else if (diffDays === 1) {
        this.streak = (this.streak || 0) + 1;
    } else if (diffDays > 1) {
        this.streak = 1;
    }

    this.longestStreak = Math.max(this.longestStreak || 0, this.streak || 0);
    this.updateWeeklyActivity(normalizedXP, moduleCompleted ? 1 : 0, activityDate);
    this.lastActivityDate = activityDate;
};

// Method to add XP and update level
userStatsSchema.methods.addXP = async function (amount, options = {}) {
    if (typeof options === 'boolean') {
        options = { moduleCompleted: options };
    }

    const {
        moduleCompleted = false,
        activityDate = new Date(),
        save = true
    } = options;

    const normalizedAmount = Number(amount) || 0;
    if (normalizedAmount > 0) {
        this.totalXP += normalizedAmount;
        this.level = this.calculateLevel();
    }

    this.recordActivity({
        xpEarned: normalizedAmount,
        moduleCompleted,
        activityDate
    });

    if (save) {
        await this.save();
    }
    return this;
};

// Method to get weekly activity for display (last 7 days)
userStatsSchema.methods.getWeeklyActivityForDisplay = function () {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const result = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get max XP in the week for scaling
    let maxXP = 100; // Minimum scale
    this.weeklyActivity.forEach(entry => {
        if (entry.xpEarned > maxXP) maxXP = entry.xpEarned;
    });

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setUTCHours(0, 0, 0, 0);

        const activity = this.weeklyActivity.find(entry => {
            const entryDate = toUtcDayStart(entry.date);
            return entryDate.getTime() === date.getTime();
        });

        const xpEarned = activity ? activity.xpEarned : 0;
        const heightPercent = maxXP > 0 ? Math.round((xpEarned / maxXP) * 100) : 0;

        result.push({
            day: i === 0 ? 'Auj.' : days[date.getDay()],
            date: date.toISOString().split('T')[0],
            xpEarned: xpEarned,
            modulesCompleted: activity ? activity.modulesCompleted : 0,
            height: `${Math.max(heightPercent, 5)}%`, // Minimum 5% for visibility
            isToday: i === 0
        });
    }

    return result;
};

module.exports = mongoose.model('UserStats', userStatsSchema);
