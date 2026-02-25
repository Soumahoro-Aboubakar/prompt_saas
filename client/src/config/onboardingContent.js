/**
 * Onboarding content configuration for each route.
 * Each entry provides the modal content shown to new users.
 */
const onboardingContent = {
    '/dashboard': {
        icon: 'solar:home-2-bold',
        title: 'Bienvenue sur votre Dashboard !',
        description:
            'Votre tableau de bord centralise toutes vos informations clés : progression, statistiques et modules recommandés.',
        features: [
            {
                icon: 'solar:chart-2-bold',
                text: 'Suivez votre progression et vos statistiques en temps réel',
            },
            {
                icon: 'solar:star-bold',
                text: 'Découvrez les modules recommandés selon votre niveau',
            },
            {
                icon: 'solar:fire-bold',
                text: 'Maintenez votre streak quotidienne pour gagner plus de XP',
            },
        ],
    },

    '/formations': {
        icon: 'solar:book-bookmark-bold',
        title: 'Explorez vos Formations',
        description:
            'La bibliothèque de formations est votre espace d\'apprentissage principal. Chaque formation est composée de modules progressifs adaptés à votre niveau.',
        features: [
            {
                icon: 'solar:widget-5-bold',
                text: 'Parcourez les modules organisés par niveau de difficulté',
            },
            {
                icon: 'solar:target-bold',
                text: 'Complétez les exercices pour valider chaque module',
            },
            {
                icon: 'solar:medal-ribbons-star-bold',
                text: 'Gagnez des XP et débloquez des badges en progressant',
            },
        ],
    },

    '/suggestions': {
        icon: 'solar:chat-round-dots-bold',
        title: 'Vos Suggestions comptent !',
        description:
            'Cet espace vous permet de proposer des idées, signaler des améliorations ou partager vos retours pour enrichir la plateforme.',
        features: [
            {
                icon: 'solar:lightbulb-bold',
                text: 'Proposez de nouvelles fonctionnalités ou formations',
            },
            {
                icon: 'solar:like-bold',
                text: 'Votez pour les idées de la communauté',
            },
            {
                icon: 'solar:shield-check-bold',
                text: 'Signalez des bugs ou des points d\'amélioration',
            },
        ],
    },

    '/formations/:id': {
        icon: 'solar:notebook-bold',
        title: 'Détail de la Formation',
        description:
            'Vous êtes dans un module de formation. Lisez la leçon, puis testez vos connaissances en répondant aux exercices interactifs.',
        features: [
            {
                icon: 'solar:document-text-bold',
                text: 'Lisez attentivement la leçon avant de répondre',
            },
            {
                icon: 'solar:pen-new-square-bold',
                text: 'Rédigez votre réponse et soumettez-la pour correction IA',
            },
            {
                icon: 'solar:arrow-right-bold',
                text: 'Passez au module suivant une fois validé',
            },
        ],
    },
};

export default onboardingContent;
