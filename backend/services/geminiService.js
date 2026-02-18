const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();
/*
***bon  et rapide
gemini-2.5-flash-lite jusqu'il salut au depart exemple : Bonjour ! Il semble que vous ayez recopié l'énoncé de l'exercice au lieu de rédiger votre propre prompt. L'idée est de créer une instruction pour l'IA en suivant les critères demandés. N'hésitez pas à relire la consigne et à essayer de construire votre propre demande à l'IA. Chaque début est une étape d'apprentissage, et je suis là pour vous guider !


**très bon mains lent 
--gemini-3-flash-preview


--bad 
gemini-2.5-flash
*/
// Support multiple env variable names for the API key
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.apiKey;
const modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview"  // "gemini-2.5-flash"; //"gemini-2.5-flash-lite"; //  "gemini-3-flash-preview"; //'';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `Tu es un correcteur pédagogique bienveillant pour une plateforme d'apprentissage du prompt engineering destinée aux débutants.

RÔLE : Évaluer la qualité du prompt rédigé par l'apprenant par rapport à l'exercice donné.

RÈGLES STRICTES :
- Tu NE DOIS JAMAIS donner la solution ni réécrire le prompt à la place de l'apprenant.
- Si le prompt est incorrect, explique POURQUOI il ne fonctionne pas et donne des PISTES d'amélioration.
- Sois encourageant, clair et pédagogique.
- Utilise un langage simple adapté aux débutants.

RÉPONSE OBLIGATOIRE en JSON strict :
{
  "score": <number 0-100>,
  "passed": <boolean>,
  "feedback": [
    { "text": "<critère évalué>", "passed": <boolean> }
  ],
  "message": "<message global à l'apprenant>"
}

CRITÈRES DE NOTATION :
- score >= 75 → passed = true (l'apprenant réussit)
- score < 75 → passed = false (feedback détaillé obligatoire)

Si passed = true :
- Message court de félicitation
- feedback = liste des critères tous validés

Si passed = false :
- Message encourageant expliquant les points à améliorer
- feedback = liste des critères avec passed=true ou false
- Pour chaque critère échoué, le texte doit expliquer clairement ce qui manque et donner un indice (SANS résoudre)`;

/**
 * Attempts to repair truncated JSON by closing open structures
 */
function repairTruncatedJson(jsonStr) {
    let str = jsonStr;

    // Remove the last incomplete element after a comma
    str = str.replace(/,\s*("[^"]*":\s*)?("[^"]*)?$/g, '');
    str = str.replace(/,\s*\{[^}]*$/g, '');
    str = str.replace(/,\s*"[^"]*$/g, '');

    // Count open braces and brackets
    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escape = false;

    for (const char of str) {
        if (escape) { escape = false; continue; }
        if (char === '\\') { escape = true; continue; }
        if (char === '"') { inString = !inString; continue; }
        if (!inString) {
            if (char === '{') openBraces++;
            else if (char === '}') openBraces--;
            else if (char === '[') openBrackets++;
            else if (char === ']') openBrackets--;
        }
    }

    // Close unterminated strings (if odd number of quotes)
    const quoteCount = (str.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) {
        str += '"';
    }

    // Close open structures
    while (openBrackets > 0) { str += ']'; openBrackets--; }
    while (openBraces > 0) { str += '}'; openBraces--; }

    return str;
}

/**
 * Parse JSON from Gemini response text, with truncation repair fallback
 */
function parseJsonFromResponse(text) {
    const trimmed = text.trim();
    const start = trimmed.indexOf('{');

    if (start === -1) {
        throw new Error('Invalid Gemini response: no JSON found');
    }

    // Find the end of JSON (last closing brace)
    const end = trimmed.lastIndexOf('}') + 1;
    let jsonStr = end > start ? trimmed.slice(start, end) : trimmed.slice(start);

    // First attempt: direct parsing
    try {
        return JSON.parse(jsonStr);
    } catch (firstError) {
        console.warn('Malformed JSON from Gemini, attempting repair...', firstError.message);

        // Second attempt: repair truncated JSON
        try {
            const repairedJson = repairTruncatedJson(jsonStr);
            const result = JSON.parse(repairedJson);
            console.log('Gemini JSON repaired successfully');
            return result;
        } catch (repairError) {
            console.error('Gemini JSON repair failed:', repairError.message);

            // Fallback: return a minimal valid structure
            console.warn('Returning default structure');
            return {
                score: 0,
                passed: false,
                feedback: [],
                message: 'Incomplete analysis: the Gemini response was truncated. Please try again.',
            };
        }
    }
}

/**
 * Call Gemini API with a prompt and options
 */
async function generateContent(prompt, options = {}) {
    if (!genAI) throw new Error('GEMINI_API_KEY not configured');

    const {
        systemInstruction = null,
        temperature = 0.3,
        maxOutputTokens = 2048,
        model = modelName,
    } = options;

    const fullPrompt = systemInstruction
        ? `${systemInstruction}\n\n---\n\n${prompt}`
        : prompt;

    const generationConfig = {
        temperature,
        maxOutputTokens,
        topP: 0.95,
        topK: 40,
    };

    // ✅ Correct syntax for @google/generative-ai SDK
    const geminiModel = genAI.getGenerativeModel({
        model,
        generationConfig,
    });

    const result = await geminiModel.generateContent(fullPrompt);
    return result.response.text();
}

/**
 * Validate a user's answer using Gemini
 * @param {Object} exercise - { instruction, badPrompt, validationCriteria, exampleSolution, hint }
 * @param {string} userAnswer - The user's submitted prompt
 * @param {string} moduleTitle - Title of the current module for context
 * @returns {Object} { score, passed, feedback, message }
 */
async function validateAnswer(exercise, userAnswer, moduleTitle = '') {
    const userPrompt = `EXERCICE : ${exercise.instruction}
PROMPT DÉFAILLANT À AMÉLIORER : "${exercise.badPrompt}"
CRITÈRES D'ÉVALUATION : ${(exercise.validationCriteria || []).join(', ')}
MODULE : ${moduleTitle}

RÉPONSE DE L'APPRENANT :
"""
${userAnswer}
"""

Évalue cette réponse. Retourne UNIQUEMENT le JSON.`;

    try {
        const content = await generateContent(userPrompt, {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.3,
            maxOutputTokens: 2048,
        });

        if (!content) {
            throw new Error('Empty response from Gemini');
        }

        const result = parseJsonFromResponse(content);

        return {
            score: Number(result.score) || 0,
            passed: Boolean(result.passed),
            feedback: Array.isArray(result.feedback) ? result.feedback : [],
            message: result.message || '',
        };
    } catch (error) {
        console.error('Gemini validation error:', error.message);
        throw error;
    }
}

module.exports = { validateAnswer, generateContent };
