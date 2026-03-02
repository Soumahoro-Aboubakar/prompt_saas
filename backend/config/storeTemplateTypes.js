const SYSTEM_TEMPLATE_TYPES = [
    {
        key: 'image',
        label: "Génération d'images",
        description: 'Templates orientés génération d’images IA avec aperçu visuel.',
        icon: 'solar:gallery-wide-linear',
        capabilities: ['visual_preview', 'supports_render_example'],
        isSystem: true,
        isActive: true,
        order: 1
    },
    {
        key: 'web_ui',
        label: 'Création de pages & sections web',
        description: 'Templates React + Tailwind avec aperçu de rendu compilé.',
        icon: 'solar:monitor-smartphone-linear',
        capabilities: ['live_preview', 'supports_fullscreen', 'supports_site_assembly'],
        isSystem: true,
        isActive: true,
        order: 2
    },
    {
        key: 'ui_design',
        label: 'Design UI',
        description: 'Prompts UI/UX orientés maquettes et design system.',
        icon: 'solar:palette-linear',
        capabilities: ['visual_preview'],
        isSystem: true,
        isActive: true,
        order: 3
    },
    {
        key: 'text',
        label: 'Prompt pur',
        description: 'Prompts text-only pour rédaction, analyse et développement.',
        icon: 'solar:pen-new-square-linear',
        capabilities: ['text_focused'],
        isSystem: true,
        isActive: true,
        order: 4
    }
];

const normalizeTypeKey = (value = '') => {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
};

module.exports = {
    SYSTEM_TEMPLATE_TYPES,
    normalizeTypeKey
};
