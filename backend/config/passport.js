const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const UserStats = require('../models/UserStats');

// Serialize/Deserialize (minimal — we use JWT, not sessions)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

/**
 * Find or create user from OAuth profile.
 * If user already exists with same email, link the OAuth provider.
 */
const findOrCreateOAuthUser = async (profile, provider) => {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const displayName = profile.displayName || profile.username || 'User';
    const avatar = profile.photos?.[0]?.value || null;

    if (!email) {
        throw new Error('No email found from OAuth provider');
    }

    // Check if user exists with this OAuth provider ID
    let user = await User.findOne({
        authProvider: provider,
        authProviderId: profile.id
    });

    if (user) return user;

    // Check if user exists with this email (potentially linking accounts)
    user = await User.findOne({ email });

    if (user) {
        // Link the OAuth provider to existing account
        user.authProvider = provider;
        user.authProviderId = profile.id;
        user.isVerified = true;
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
        return user;
    }

    // Create a new user
    user = await User.create({
        fullName: displayName,
        email,
        authProvider: provider,
        authProviderId: profile.id,
        isVerified: true,
        avatar
    });

    // Create initial stats
    await UserStats.create({
        user: user._id,
        totalXP: 0,
        level: 1,
        streak: 0
    });

    return user;
};

// ---------- Google Strategy ----------
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateOAuthUser(profile, 'google');
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
}

// ---------- GitHub Strategy ----------
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateOAuthUser(profile, 'github');
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
}

module.exports = passport;
