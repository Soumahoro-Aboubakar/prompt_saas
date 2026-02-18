const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
 * Validate a user's answer using GPT-4o Mini
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
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 500,
            temperature: 0.3,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Empty response from OpenAI');
        }

        const result = JSON.parse(content);

        // Ensure required fields exist
        return {
            score: Number(result.score) || 0,
            passed: Boolean(result.passed),
            feedback: Array.isArray(result.feedback) ? result.feedback : [],
            message: result.message || '',
        };
    } catch (error) {
        console.error('OpenAI validation error:', error.message);
        throw error;
    }
}

module.exports = { validateAnswer };
