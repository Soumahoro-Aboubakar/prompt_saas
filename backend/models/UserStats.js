const mongoose = require('mongoose');

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
userStatsSchema.methods.updateWeeklyActivity = function (xpEarned, modulesCompleted = 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's entry
    const todayIndex = this.weeklyActivity.findIndex(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
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
    sevenDaysAgo.setHours(0, 0, 0, 0);

    this.weeklyActivity = this.weeklyActivity.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= sevenDaysAgo;
    });
};

// Method to add XP and update level
userStatsSchema.methods.addXP = async function (amount, moduleCompleted = false) {
    this.totalXP += amount;
    this.level = this.calculateLevel();

    // Update weekly activity
    this.updateWeeklyActivity(amount, moduleCompleted ? 1 : 0);

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = new Date(this.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        this.streak += 1;
        if (this.streak > this.longestStreak) {
            this.longestStreak = this.streak;
        }
    } else if (diffDays > 1) {
        this.streak = 1;
    }

    this.lastActivityDate = new Date();

    await this.save();
    return this;
};

// Method to get weekly activity for display (last 7 days)
userStatsSchema.methods.getWeeklyActivityForDisplay = function () {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get max XP in the week for scaling
    let maxXP = 100; // Minimum scale
    this.weeklyActivity.forEach(entry => {
        if (entry.xpEarned > maxXP) maxXP = entry.xpEarned;
    });

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const activity = this.weeklyActivity.find(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
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
