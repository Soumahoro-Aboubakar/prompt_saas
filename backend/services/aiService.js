/**
 * AI Service Factory
 *
 * Dynamically selects the AI provider based on the AI_PROVIDER environment variable.
 * Supported providers: 'gemini' (default), 'openai'
 *
 * Usage:
 *   const { validateAnswer } = require('./aiService');
 */

const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

let service;

if (provider === 'openai') {
    service = require('./openaiService');
    console.log('[AI Service] Provider: OpenAI (ChatGPT)');
} else {
    service = require('./geminiService');
    console.log('[AI Service] Provider: Google Gemini ');
}

/**
 * Returns the currently active AI provider name
 * @returns {string} 'gemini' or 'openai'
 */
function getProvider() {
    return provider;
}

/**
 * Checks if the required API key is configured for the active provider
 * @returns {boolean}
 */
function isApiKeyConfigured() {
    if (provider === 'openai') {
        return !!process.env.OPENAI_API_KEY;
    }
    // Gemini supports multiple env variable names
    return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.apiKey);
}

/**
 * Returns a human-readable label for the missing API key
 * @returns {string}
 */
function getApiKeyLabel() {
    return provider === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY (or GOOGLE_API_KEY)';
}

module.exports = {
    validateAnswer: service.validateAnswer,
    getProvider,
    isApiKeyConfigured,
    getApiKeyLabel,
};
