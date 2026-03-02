const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const UserStats = require('../models/UserStats');
const { protect } = require('../middleware/auth');
const { sendEmail, buildResetPasswordEmail, buildVerifyEmail, buildWelcomeEmail } = require('../utils/email');
const { getLockedBadges } = require('../utils/badges');
const { buildStatsPayload } = require('../utils/statsPayload');
const passport = require('passport');

const EMAIL_OTP_TTL_MINUTES = Number(process.env.EMAIL_OTP_TTL_MINUTES || 10);
const EMAIL_OTP_MAX_ATTEMPTS = Number(process.env.EMAIL_OTP_MAX_ATTEMPTS || 5);
const EMAIL_OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.EMAIL_OTP_RESEND_COOLDOWN_SECONDS || 60);

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

const generateEmailVerificationCode = () => {
    return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
};

const hashValue = (value) => {
    return crypto.createHash('sha256').update(value).digest('hex');
};

const setEmailVerificationCode = (user, code) => {
    user.emailVerificationCodeHash = hashValue(code);
    user.emailVerificationCodeExpires = new Date(Date.now() + EMAIL_OTP_TTL_MINUTES * 60 * 1000);
    user.emailVerificationAttempts = 0;
    user.emailVerificationLastSentAt = new Date();
};

const sendEmailVerificationCode = async (user) => {
    const code = generateEmailVerificationCode();
    setEmailVerificationCode(user, code);
    await user.save();

    const verifyEmail = buildVerifyEmail({
        name: user.fullName,
        otpCode: code,
        expiresInMinutes: EMAIL_OTP_TTL_MINUTES
    });

    await sendEmail({
        to: user.email,
        subject: verifyEmail.subject,
        html: verifyEmail.html,
        text: verifyEmail.text
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password
        });

        // Create initial stats for user
        await UserStats.create({
            user: user._id,
            totalXP: 0,
            level: 1,
            streak: 0
        });

        // Generate and send OTP verification code (non-blocking for signup success)
        try {
            await sendEmailVerificationCode(user);
        } catch (emailError) {
            console.error('Verify email error:', emailError.message);
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating account',
            error: error.message
        });
    }
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetToken +passwordResetExpires');
        if (!user) {
            return res.json({
                success: true,
                message: 'If an account exists, a reset email has been sent',
                ...(process.env.NODE_ENV === 'development' ? { dev: { emailFound: false } } : {})
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.passwordResetToken = resetTokenHash;
        user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
        await user.save();

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

        const resetEmail = buildResetPasswordEmail({
            name: user.fullName,
            resetUrl
        });
        try {
            const response = await sendEmail({
                to: user.email,
                subject: resetEmail.subject,
                html: resetEmail.html,
                text: resetEmail.text
            });

            if (process.env.NODE_ENV === 'development') {
                console.log('Reset email sent:', response?.data?.id || response);
            }
        } catch (emailError) {
            console.error('Reset email error:', emailError);
            if (emailError.status) {
                return res.status(emailError.status).json({
                    success: false,
                    message: emailError.message,
                    details: emailError.details
                });
            }
            return res.status(500).json({
                success: false,
                message: process.env.NODE_ENV === 'development'
                    ? `Email send failed: ${emailError.message}`
                    : 'Error sending reset email'
            });
        }

        return res.json({
            success: true,
            message: 'If an account exists, a reset email has been sent',
            ...(process.env.NODE_ENV === 'development' ? { dev: { emailFound: true } } : {})
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        if (error.status) {
            return res.status(error.status).json({
                success: false,
                message: error.message,
                details: error.details
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error processing password reset'
        });
    }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide token and new password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: tokenHash,
            passwordResetExpires: { $gt: new Date() }
        }).select('+password +passwordResetToken +passwordResetExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const stats = await UserStats.findOne({ user: req.user._id });

        let statsPayload = null;
        if (stats) {
            const streakReset = stats.resetStreakIfExpired();
            if (streakReset) {
                await stats.save();
            }

            const earnedBadgeIds = stats.badges.map(b => b.id);
            const lockedBadges = getLockedBadges(earnedBadgeIds).slice(0, 3);
            statsPayload = buildStatsPayload(stats, { lockedBadges });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
                isVerified: user.isVerified
            },
            stats: statsPayload
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
});

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification-code
// @access  Private
router.post('/resend-verification-code', protect, async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select('+emailVerificationLastSentAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
        }

        if (user.emailVerificationLastSentAt) {
            const elapsedSeconds = Math.floor((Date.now() - user.emailVerificationLastSentAt.getTime()) / 1000);
            if (elapsedSeconds < EMAIL_OTP_RESEND_COOLDOWN_SECONDS) {
                return res.status(429).json({
                    success: false,
                    message: 'Please wait before requesting a new code',
                    retryAfterSeconds: EMAIL_OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds
                });
            }
        }

        await sendEmailVerificationCode(user);

        return res.json({
            success: true,
            message: 'Verification code sent'
        });
    } catch (error) {
        console.error('Resend verification code error:', error);
        if (error.status) {
            return res.status(error.status).json({
                success: false,
                message: error.message,
                details: error.details
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error sending verification code'
        });
    }
});

// @desc    Verify email with OTP code
// @route   POST /api/auth/verify-code
// @access  Private
router.post('/verify-code', protect, async (req, res) => {
    try {
        const { code } = req.body;

        const normalizedCode = String(code || '').trim();
        if (!/^\d{6}$/.test(normalizedCode)) {
            return res.status(400).json({
                success: false,
                message: 'A valid 6-digit code is required'
            });
        }

        const user = await User.findById(req.user._id).select(
            '+emailVerificationCodeHash +emailVerificationCodeExpires +emailVerificationAttempts'
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.json({
                success: true,
                message: 'Email already verified'
            });
        }
        if (!user.emailVerificationCodeHash || !user.emailVerificationCodeExpires || user.emailVerificationCodeExpires <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Code is invalid or expired'
            });
        }

        if (user.emailVerificationAttempts >= EMAIL_OTP_MAX_ATTEMPTS) {
            return res.status(429).json({
                success: false,
                message: 'Too many attempts. Request a new code.'
            });
        }

        const incomingCodeHash = hashValue(normalizedCode);
        if (incomingCodeHash !== user.emailVerificationCodeHash) {
            user.emailVerificationAttempts += 1;
            await user.save();
            return res.status(400).json({
                success: false,
                message: 'Code is invalid or expired'
            });
        }

        user.isVerified = true;
        user.emailVerificationCodeHash = undefined;
        user.emailVerificationCodeExpires = undefined;
        user.emailVerificationAttempts = 0;
        user.emailVerificationLastSentAt = undefined;
        await user.save();

        /* // Send welcome email (optional, non-blocking)
          try {
              const welcome = buildWelcomeEmail({ name: user.fullName });
              await sendEmail({
                  to: user.email,
                  subject: welcome.subject,
                  html: welcome.html,
                  text: welcome.text
              });
          } catch (emailError) {
              console.error('Welcome email error:', emailError.message);
          }  */

        return res.json({
            success: true,
            message: 'Email verified successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Verify code error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying code'
        });
    }
});

// ==================== OAuth Routes ====================

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// @desc    Initiate Google OAuth
// @route   GET /api/auth/google
// @access  Public
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login?error=google_auth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
    }
);

// @desc    Initiate GitHub OAuth
// @route   GET /api/auth/github
// @access  Public
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
);

// @desc    GitHub OAuth callback
// @route   GET /api/auth/github/callback
// @access  Public
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${CLIENT_URL}/login?error=github_auth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
    }
);

module.exports = router;
