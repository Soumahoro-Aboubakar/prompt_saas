// Formation Service - Dynamic loader for formation data based on user level

// Import all formation JSON files
import formationsDebutants from '../../data/formations_debutants.json';
import formationsIntermediaires from '../../data/formations_intermediares.json';

/**
 * User levels and their corresponding data sources
 * Easy to extend: just add new levels and their JSON imports
 */
const LEVEL_CONFIG = {
    debutant: {
        label: 'Débutant',
        moduleRange: [1, 4], // Modules 1-4
        data: formationsDebutants
    },
    intermediaire: {
        label: 'Intermédiaire',
        moduleRange: [5, 8], // Modules 5-8
        data: formationsIntermediaires
    },
    avance: {
        label: 'Avancé',
        moduleRange: [9, 12], // Modules 9-12 (future)
        data: null // To be added: formationsAvances
    },
    expert: {
        label: 'Expert',
        moduleRange: [13, 16], // Modules 13-16 (future)
        data: null // To be added: formationsExperts
    }
}; 

/**
 * Get the level key for a given module ID
 * @param {number} moduleId 
 * @returns {string} Level key (debutant, intermediaire, etc.)
 */
export const getLevelForModule = (moduleId) => {
    for (const [levelKey, config] of Object.entries(LEVEL_CONFIG)) {
        const [min, max] = config.moduleRange;
        if (moduleId >= min && moduleId <= max) {
            return levelKey;
        }
    }
    return 'debutant'; // Default fallback
};

/**
 * Get level configuration
 * @param {string} levelKey 
 * @returns {object} Level config
 */
export const getLevelConfig = (levelKey) => {
    return LEVEL_CONFIG[levelKey] || LEVEL_CONFIG.debutant;
};

/**
 * Get all available levels with their configs
 * @returns {object} All level configs
 */
export const getAllLevels = () => {
    return LEVEL_CONFIG;
};

/**
 * Get formation data for a specific module ID
 * Automatically selects the correct JSON file based on module ID
 * @param {number} moduleId 
 * @returns {object|null} Formation data or null if not found
 */
export const getFormationById = (moduleId) => {
    const levelKey = getLevelForModule(moduleId);
    const levelConfig = LEVEL_CONFIG[levelKey];

    if (!levelConfig || !levelConfig.data) {
        console.warn(`No data available for level: ${levelKey}`);
        return null;
    }

    const formationsData = levelConfig.data.formationsData;
    return formationsData[moduleId.toString()] || null;
};

/**
 * Get all formations for a specific level
 * @param {string} levelKey 
 * @returns {object} Formations data object
 */
export const getFormationsByLevel = (levelKey) => {
    const levelConfig = LEVEL_CONFIG[levelKey];

    if (!levelConfig || !levelConfig.data) {
        return {};
    }

    return levelConfig.data.formationsData;
};

/**
 * Get all available formations (from all levels)
 * @returns {Array} Array of formation objects with their IDs
 */
export const getAllFormations = () => {
    const allFormations = [];

    for (const [levelKey, config] of Object.entries(LEVEL_CONFIG)) {
        if (config.data && config.data.formationsData) {
            const formations = config.data.formationsData;
            for (const [id, formation] of Object.entries(formations)) {
                allFormations.push({
                    id: parseInt(id),
                    level: levelKey,
                    levelLabel: config.label,
                    ...formation
                });
            }
        }
    }

    // Sort by ID
    return allFormations.sort((a, b) => a.id - b.id);
};

/**
 * Get formations list with summary info (for listing pages)
 * @returns {Array} Array of formation summaries
 */
export const getFormationsList = () => {
    return getAllFormations().map(f => ({
        id: f.id,
        title: f.title,
        category: f.category,
        difficulty: f.difficulty,
        duration: f.duration,
        xp: f.xp,
        level: f.level,
        levelLabel: f.levelLabel
    }));
};

/**
 * Get default/placeholder formation for modules without data
 * @param {number} moduleId 
 * @returns {object} Default formation structure
 */
export const getDefaultFormation = (moduleId) => {
    const levelKey = getLevelForModule(moduleId);
    const levelConfig = LEVEL_CONFIG[levelKey];

    return {
        title: `Module ${moduleId}`,
        category: levelConfig?.label || 'En développement',
        difficulty: levelConfig?.label || 'Intermédiaire',
        duration: '25 min',
        xp: 200,
        concept: {
            title: 'Contenu en préparation',
            content: 'Ce module est en cours de développement. Le contenu sera bientôt disponible.',
            detailedContent: null
        },
        example: {
            title: 'Exemple',
            bad: { prompt: '...', response: '...', explanation: '...' },
            good: { prompt: '...', response: '...', explanation: '...' }
        },
        exercise: {
            instruction: 'Exercice en préparation',
            badPrompt: '...',
            hint: '...',
            validationCriteria: [],
            exampleSolution: '...'
        }
    };
};

/**
 * Get formation with fallback to default if not found
 * @param {number} moduleId 
 * @returns {object} Formation data (real or default)
 */
export const getFormationOrDefault = (moduleId) => {
    const formation = getFormationById(moduleId);
    return formation || getDefaultFormation(moduleId);
};

/**
 * Get the total number of available formations
 * @returns {number} Count of formations
 */
export const getFormationsCount = () => {
    return getAllFormations().length;
};

/**
 * Check if a specific module exists in the data
 * @param {number} moduleId 
 * @returns {boolean}
 */
export const formationExists = (moduleId) => {
    return getFormationById(moduleId) !== null;
};

export default {
    getFormationById,
    getFormationsByLevel,
    getAllFormations,
    getFormationsList,
    getDefaultFormation,
    getFormationOrDefault,
    getFormationsCount,
    formationExists,
    getLevelForModule,
    getLevelConfig,
    getAllLevels
};
