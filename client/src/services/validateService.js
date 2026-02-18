import api from './api';

/**
 * Validate a user's answer using AI
 * @param {number} moduleId - The module ID
 * @param {string} userAnswer - The user's submitted prompt
 * @param {Object} exercise - Exercise data (instruction, badPrompt, validationCriteria, etc.)
 * @param {string} moduleTitle - Title of the module
 * @returns {Promise<{ score, passed, feedback, message }>}
 */
export async function validateAnswer(moduleId, userAnswer, exercise, moduleTitle) {
    const response = await api.post('/validate', {
        moduleId,
        userAnswer,
        exercise: {
            instruction: exercise.instruction,
            badPrompt: exercise.badPrompt,
            validationCriteria: exercise.validationCriteria,
            exampleSolution: exercise.exampleSolution,
            hint: exercise.hint,
        },
        moduleTitle,
    });
    return response.data;
}

export default { validateAnswer };
