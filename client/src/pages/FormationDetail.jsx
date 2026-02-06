import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

// Formation content database
const formationsData = {
    1: {
        title: "Introduction à l'IA générative",
        category: "Fondamentaux",
        difficulty: "Débutant",
        duration: "15 min",
        xp: 100,
        concept: {
            title: "Qu'est-ce que l'IA générative ?",
            content: `L'intelligence artificielle générative est une branche de l'IA capable de créer du contenu nouveau : texte, images, code, musique, et bien plus encore.

**Les modèles de langage (LLM)** comme GPT, Claude ou Gemini sont entraînés sur d'immenses quantités de données textuelles. Ils apprennent les patterns du langage humain et peuvent ensuite générer des réponses cohérentes et contextuelles.

**Comment ça fonctionne ?**
1. **Tokenisation** : Le texte est découpé en unités appelées "tokens"
2. **Prédiction** : Le modèle prédit le token suivant le plus probable
3. **Génération** : Cette prédiction est répétée pour créer des phrases complètes

**Le prompting** est l'art de communiquer efficacement avec ces modèles. Un bon prompt permet d'obtenir des réponses précises, utiles et pertinentes.`,
            detailedContent: {
                title: "Plongée approfondie dans l'IA générative",
                sections: [
                    {
                        title: "Histoire et évolution",
                        content: `L'IA générative a connu une évolution fulgurante ces dernières années. Tout a commencé avec les réseaux de neurones récurrents (RNN), puis les architectures Transformer introduites par Google en 2017 ont révolutionné le domaine.

Les modèles actuels comme GPT-4, Claude, et Gemini contiennent des centaines de milliards de paramètres et sont capables de performances quasi-humaines dans de nombreuses tâches linguistiques.`
                    },
                    {
                        title: "Types d'IA générative",
                        content: `**Modèles de langage (LLM)** : Génèrent du texte (ChatGPT, Claude, Gemini)

**Modèles de diffusion** : Créent des images (DALL-E, Midjourney, Stable Diffusion)

**Modèles audio** : Produisent de la musique ou de la parole (Suno, ElevenLabs)

**Modèles vidéo** : Génèrent des séquences vidéo (Sora, Runway)

**Modèles multimodaux** : Combinent plusieurs types de contenu (GPT-4V, Gemini)`
                    },
                    {
                        title: "L'architecture Transformer",
                        content: `Le mécanisme d'**attention** est au cœur des Transformers. Il permet au modèle de "regarder" toutes les parties d'une phrase simultanément, plutôt que séquentiellement.

**Self-attention** : Chaque mot évalue sa relation avec tous les autres mots
**Multi-head attention** : Plusieurs "têtes" analysent différents aspects
**Position encoding** : Le modèle comprend l'ordre des mots

Cette architecture permet de traiter des contextes très longs et de capturer des dépendances complexes entre les mots.`
                    },
                    {
                        title: "Limites et considérations",
                        content: `**Hallucinations** : Les LLM peuvent inventer des informations qui semblent plausibles mais sont fausses

**Biais** : Les modèles reflètent les biais présents dans leurs données d'entraînement

**Connaissance limitée** : La date de coupure signifie que le modèle ne connaît pas les événements récents

**Raisonnement** : Les LLM excellent dans la reconnaissance de patterns mais peuvent échouer sur le raisonnement logique complexe

**Coût environnemental** : L'entraînement et l'inférence consomment beaucoup d'énergie`
                    }
                ]
            }
        },
        example: {
            title: "Exemple de prompt basique",
            bad: {
                prompt: "Parle-moi de Python",
                response: "Python est un langage de programmation...",
                explanation: "Ce prompt est trop vague. L'IA ne sait pas quel aspect de Python vous intéresse."
            },
            good: {
                prompt: "Explique-moi les avantages de Python pour un débutant en programmation, en 3 points clés.",
                response: "Voici les 3 avantages principaux de Python pour débuter :\n\n1. **Syntaxe lisible** : Python utilise une syntaxe proche du langage naturel...\n2. **Large communauté** : Des milliers de tutoriels et ressources disponibles...\n3. **Versatilité** : Web, data science, automatisation...",
                explanation: "Ce prompt est spécifique : il précise le contexte (débutant), le format (3 points) et l'objectif (avantages)."
            }
        },
        exercise: {
            instruction: "Réécrivez le prompt suivant pour le rendre plus précis et obtenir une meilleure réponse de l'IA.",
            badPrompt: "Aide-moi avec Excel",
            hint: "Pensez à préciser : quel problème ? quel niveau ? quel format de réponse souhaitez-vous ?",
            validationCriteria: ["spécifique", "contexte", "format", "objectif"],
            exampleSolution: "Je suis débutant sur Excel. Explique-moi comment créer une formule SOMME pour additionner les valeurs de la colonne A (lignes 1 à 10), étape par étape."
        }
    },
    2: {
        title: "Structure d'un prompt efficace",
        category: "Fondamentaux",
        difficulty: "Débutant",
        duration: "20 min",
        xp: 150,
        concept: {
            title: "Les 4 piliers d'un prompt efficace",
            content: `Un prompt efficace repose sur une structure claire qui guide l'IA vers la réponse souhaitée.

**1. Le Contexte**
Donnez à l'IA les informations de fond nécessaires. Plus le contexte est précis, plus la réponse sera pertinente.

**2. L'Instruction**
Soyez explicite sur ce que vous attendez. Utilisez des verbes d'action clairs : "Explique", "Liste", "Compare", "Analyse".

**3. Le Format attendu**
Précisez comment vous voulez recevoir l'information : liste à puces, tableau, paragraphes, code, etc.

**4. Les Contraintes**
Ajoutez des limites : longueur, ton, niveau de détail, ce qu'il faut éviter.

**La formule magique :**
\`[Contexte] + [Instruction] + [Format] + [Contraintes]\``,
            detailedContent: {
                title: "Maîtriser la structure des prompts",
                sections: [
                    {
                        title: "Le Contexte en profondeur",
                        content: `Le contexte est la fondation de tout bon prompt. Il répond aux questions : Qui êtes-vous ? Dans quelle situation êtes-vous ? Qu'avez-vous déjà essayé ?

**Exemples de contexte efficace :**
- "Je suis développeur junior avec 6 mois d'expérience en Python"
- "Je gère une équipe de 5 personnes dans une startup e-commerce"
- "Je prépare un cours de mathématiques pour des élèves de terminale"

**Mauvais contexte :**
- "Je travaille dans le web" (trop vague)
- Absence totale de contexte`
                    },
                    {
                        title: "L'art de l'instruction",
                        content: `**Verbes d'action puissants :**

| Objectif | Verbes recommandés |
|----------|--------------------|
| Expliquer | Explique, Décris, Détaille |
| Analyser | Analyse, Compare, Évalue |
| Créer | Génère, Rédige, Conçois |
| Transformer | Résume, Traduis, Reformule |
| Conseiller | Recommande, Suggère, Propose |

**Technique du "Act as"** : Demandez à l'IA de jouer un rôle
"Agis comme un expert SEO senior avec 10 ans d'expérience"`
                    },
                    {
                        title: "Formater pour mieux comprendre",
                        content: `**Formats disponibles :**

• **Liste à puces** : Pour des points distincts
• **Liste numérotée** : Pour des étapes séquentielles
• **Tableau** : Pour des comparaisons
• **JSON/XML** : Pour des données structurées
• **Markdown** : Pour du contenu formaté
• **Code commenté** : Pour de la programmation

**Exemple :** "Présente ta réponse sous forme de tableau avec les colonnes : Avantage, Inconvénient, Recommandation"`
                    },
                    {
                        title: "Contraintes intelligentes",
                        content: `**Types de contraintes :**

**Longueur** : "En 200 mots maximum", "En 3 paragraphes"

**Ton** : "Style professionnel", "Ton conversationnel", "Registre académique"

**Exclusions** : "Sans jargon technique", "N'utilise pas d'exemples de..."

**Niveau** : "Comme si j'étais débutant", "Pour un public expert"

**Langue** : "En français courant", "Avec des termes techniques anglais si nécessaire"

Les contraintes évitent les réponses génériques et personnalisent vraiment l'output.`
                    }
                ]
            }
        },
        example: {
            title: "Application de la structure",
            bad: {
                prompt: "Donne-moi des idées de business",
                response: "Voici quelques idées : restaurant, boutique en ligne, consulting...",
                explanation: "Sans structure, la réponse est générique et peu utile."
            },
            good: {
                prompt: "[Contexte] Je suis développeur web avec 5 ans d'expérience et un budget de 5000€.\n[Instruction] Propose-moi 5 idées de micro-SaaS.\n[Format] Pour chaque idée : nom, description (2 lignes), investissement estimé, potentiel de revenu mensuel.\n[Contrainte] Focus sur les outils B2B pour PME.",
                response: "1. **InvoiceBot** - Automatisation de facturation...\n2. **TeamPulse** - Sondages d'équipe...",
                explanation: "Chaque élément de la structure apporte de la précision et améliore la qualité de la réponse."
            }
        },
        exercise: {
            instruction: "Créez un prompt structuré pour demander à l'IA de vous aider à planifier vos vacances. Utilisez les 4 piliers : Contexte, Instruction, Format et Contraintes.",
            badPrompt: "Planifie mes vacances",
            hint: "Précisez votre destination ou préférences, ce que vous voulez (itinéraire, budget...), le format souhaité, et vos contraintes (durée, budget, type d'activités).",
            validationCriteria: ["contexte", "instruction", "format", "contrainte"],
            exampleSolution: "[Contexte] Je voyage en couple, nous aimons la nature et la gastronomie. Budget : 2000€ pour 7 jours.\n[Instruction] Crée un itinéraire de voyage au Portugal.\n[Format] Jour par jour avec activités matin/après-midi, restaurant recommandé le soir, budget estimé.\n[Contraintes] Éviter les zones trop touristiques, privilégier les expériences authentiques."
        }
    },
    3: {
        title: "Reformulation et clarté",
        category: "Fondamentaux",
        difficulty: "Débutant",
        duration: "25 min",
        xp: 200,
        concept: {
            title: "L'art de reformuler pour plus de clarté",
            content: `La reformulation est une compétence essentielle en prompting. Elle permet d'affiner vos demandes pour obtenir exactement ce que vous cherchez.

**Pourquoi reformuler ?**
- La première réponse n'est pas satisfaisante
- Vous voulez plus de détails sur un aspect spécifique
- Vous souhaitez un angle différent

**Techniques de reformulation :**

**1. Précision progressive**
Commencez large, puis affinez avec des questions de suivi.

**2. Changement de perspective**
"Explique-le comme si j'avais 10 ans" ou "Du point de vue d'un expert".

**3. Demande de clarification**
"Peux-tu développer le point 2 ?" ou "Donne-moi un exemple concret".

**4. Reformulation négative**
Précisez ce que vous ne voulez PAS : "Sans jargon technique", "Pas de liste".`,
            detailedContent: {
                title: "Techniques avancées de reformulation",
                sections: [
                    {
                        title: "La méthode itérative",
                        content: `La reformulation n'est pas un échec, c'est une conversation. Les meilleurs résultats viennent souvent après 2-3 échanges.

**Cycle de reformulation :**
1. Prompt initial → Réponse
2. Identifier ce qui manque ou ne convient pas
3. Reformuler en précisant
4. Répéter jusqu'à satisfaction

**Phrases clés pour reformuler :**
- "C'est intéressant, mais peux-tu..."
- "J'aimerais que tu approfondisses..."
- "Ton explication est bonne, mais elle ne couvre pas..."`
                    },
                    {
                        title: "Techniques de perspective",
                        content: `**Changer d'audience :**
- "Explique comme à un enfant de 5 ans"
- "Présente cela à un CEO"
- "Vulgarise pour un non-spécialiste"

**Changer de format :**
- "Transforme cette explication en histoire"
- "Fais-en une métaphore avec la cuisine"
- "Présente cela comme un dialogue"

**Changer de ton :**
- "Rends cela plus engageant"
- "Adopte un style académique"
- "Sois plus direct et pratique"`
                    },
                    {
                        title: "Feedback constructif",
                        content: `Donnez un feedback précis sur ce qui ne va pas :

**Au lieu de :** "Ce n'est pas ce que je voulais"
**Dites :** "Ta réponse est trop théorique, j'ai besoin d'exemples pratiques que je peux appliquer demain"

**Au lieu de :** "C'est trop long"
**Dites :** "Garde uniquement les 3 points les plus importants et résume chacun en 2 phrases"

**Au lieu de :** "Je ne comprends pas"
**Dites :** "Le concept X n'est pas clair pour moi. Peux-tu l'expliquer avec une analogie du quotidien ?"`
                    },
                    {
                        title: "Éviter les pièges courants",
                        content: `**Ne faites pas :**
- Reformuler en restant aussi vague
- Ajouter trop de contraintes d'un coup
- Ignorer les bonnes parties de la réponse

**Faites :**
- Être spécifique sur ce qui ne convient pas
- Garder ce qui fonctionne et ajuster le reste
- Une seule modification majeure par reformulation

**Astuce pro :** Si après 3 reformulations vous n'obtenez pas satisfaction, reprenez à zéro avec un prompt complètement différent.`
                    }
                ]
            }
        },
        example: {
            title: "Reformulation en action",
            bad: {
                prompt: "C'est quoi le machine learning ?",
                response: "Le machine learning est une branche de l'IA qui permet aux machines d'apprendre à partir de données...",
                explanation: "Réponse correcte mais peut-être trop technique ou pas adaptée à votre niveau."
            },
            good: {
                prompt: "Tu m'as expliqué le machine learning, mais c'est encore flou. Peux-tu me l'expliquer avec une analogie simple, comme si j'étais quelqu'un qui n'a jamais fait d'informatique ? Utilise un exemple de la vie quotidienne.",
                response: "Imagine que tu apprends à reconnaître les chats. Au début, on te montre plein de photos de chats en te disant 'ça c'est un chat'. À force, tu apprends à reconnaître les caractéristiques...",
                explanation: "La reformulation précise le niveau souhaité et demande un format spécifique (analogie)."
            }
        },
        exercise: {
            instruction: "L'IA vous a donné une réponse technique sur la blockchain. Reformulez votre demande pour obtenir une explication accessible à quelqu'un sans connaissances techniques.",
            badPrompt: "Explique la blockchain",
            hint: "Utilisez une demande de changement de perspective ou une analogie. Précisez ce que vous ne voulez pas (jargon technique).",
            validationCriteria: ["simplification", "analogie", "sans jargon", "accessible"],
            exampleSolution: "Ta réponse sur la blockchain était trop technique pour moi. Peux-tu m'expliquer ce  comme si j'étais un enfant de 12 ans ? Utilise une analogie avec quelque chose de la vie quotidienne, et évite tous les termes techniques."
        }
    },
    4: {
        title: "Questions intelligentes",
        category: "Techniques",
        difficulty: "Intermédiaire",
        duration: "20 min",
        xp: 250,
        concept: {
            title: "Formuler des questions qui obtiennent des réponses",
            content: `Les questions que vous posez déterminent la qualité des réponses. Une question bien formulée est une question qui obtient une réponse actionnable.

**Types de questions efficaces :**

**1. Questions ouvertes guidées**
Au lieu de "Comment réussir ?", demandez "Quelles sont les 5 étapes clés pour réussir un entretien d'embauche en startup tech ?"

**2. Questions comparatives**
"Quelles sont les différences entre X et Y en termes de [critère spécifique] ?"

**3. Questions hypothétiques**
"Si je devais lancer un produit SaaS avec 0€ de budget marketing, quelle stratégie adopterais-tu ?"

**4. Questions de priorisation**
"Parmi ces options, laquelle recommandes-tu en priorité et pourquoi ?"

**Évitez :**
- Les questions trop vagues ("Comment ça marche ?")
- Les questions fermées quand vous voulez des détails
- Les questions multiples dans un seul prompt`,
            detailedContent: {
                title: "L'art de poser les bonnes questions",
                sections: [
                    {
                        title: "La taxonomie des questions",
                        content: `**Niveau 1 - Questions factuelles :**
"Quelle est la capitale de la France ?" → Réponse directe

**Niveau 2 - Questions explicatives :**
"Pourquoi Python est-il populaire ?" → Analyse et justification

**Niveau 3 - Questions analytiques :**
"Compare React et Vue en termes de courbe d'apprentissage" → Évaluation critique

**Niveau 4 - Questions créatives :**
"Imagine un nouveau framework qui combine les avantages des deux" → Synthèse et innovation

Plus le niveau est élevé, plus le contexte devient important.`
                    },
                    {
                        title: "Questions socratiques",
                        content: `La méthode socratique consiste à guider par des questions successives :

**1. Clarification :**
"Que veux-tu dire par... ?"
"Peux-tu me donner un exemple de... ?"

**2. Exploration des hypothèses :**
"Qu'est-ce qui te fait penser que... ?"
"Est-ce toujours le cas ?"

**3. Implications :**
"Si cela est vrai, alors... ?"
"Quelles seraient les conséquences de... ?"

Cette approche est idéale pour approfondir un sujet complexe.`
                    },
                    {
                        title: "Questions à haute valeur ajoutée",
                        content: `**Questions "Et si..." :**
- Ouvrent des possibilités créatives
- Permettent d'explorer des scénarios
- "Et si le budget était illimité ?"

**Questions "Pourquoi pas..." :**
- Challengent les évidences
- Révèlent les contraintes cachées
- "Pourquoi ne pas utiliser une base NoSQL ?"

**Questions "Quel serait le risque de..." :**
- Anticipent les problèmes
- Préparent les contingences
- "Quel serait le risque d'ignorer ce warning ?"`
                    },
                    {
                        title: "Erreurs fréquentes",
                        content: `**Questions-réponses déguisées :**
❌ "N'est-ce pas vrai que React est meilleur que Vue ?"
✅ "Quels sont les cas d'usage où React excelle par rapport à Vue ?"

**Questions trop chargées :**
❌ "Donne-moi une stratégie marketing complète pour mon startup"
✅ "Quelle serait la première action marketing prioritaire pour une startup B2B avec 0 budget ?"

**Questions sans contexte :**
❌ "C'est quoi la meilleure pratique ?"
✅ "Quelle est la meilleure pratique pour gérer les erreurs dans une API REST en Node.js ?"`
                    }
                ]
            }
        },
        example: {
            title: "Questions vagues vs Questions intelligentes",
            bad: {
                prompt: "Comment créer un site web ?",
                response: "Pour créer un site web, vous pouvez utiliser des outils comme WordPress, Wix, ou coder en HTML/CSS...",
                explanation: "Question trop large = réponse superficielle qui couvre tout sans profondeur."
            },
            good: {
                prompt: "Je suis freelance graphiste et je veux créer un portfolio en ligne pour montrer mes projets. J'ai des bases en HTML/CSS. Quelle solution technique me recommandes-tu entre WordPress, Webflow et un site codé à la main ? Compare-les sur : facilité de mise à jour, coût annuel, et personnalisation visuelle.",
                response: "Pour un portfolio de graphiste avec tes compétences, voici ma comparaison :\n\n| Critère | WordPress | Webflow | Code manuel |\n|---------|-----------|---------|-------------|\n| Mise à jour | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |...",
                explanation: "La question inclut le contexte personnel, les options à comparer, et les critères d'évaluation."
            }
        },
        exercise: {
            instruction: "Transformez cette question vague en question intelligente : 'C'est quoi le meilleur langage de programmation ?'",
            badPrompt: "C'est quoi le meilleur langage de programmation ?",
            hint: "Ajoutez : votre objectif (web, mobile, data...), votre niveau, vos critères de choix, et demandez une comparaison structurée.",
            validationCriteria: ["contexte personnel", "objectif précis", "critères", "comparaison"],
            exampleSolution: "Je suis étudiant et je veux apprendre mon premier langage de programmation pour créer des applications web. Compare Python, JavaScript et Ruby sur ces critères : facilité d'apprentissage, opportunités d'emploi en France, et ressources disponibles en français. Lequel me recommandes-tu pour commencer ?"
        }
    }
};

// Default content for modules without specific data
const getDefaultFormation = (id) => ({
    title: `Module ${id}`,
    category: "En développement",
    difficulty: "Intermédiaire",
    duration: "25 min",
    xp: 200,
    concept: {
        title: "Contenu en préparation",
        content: "Ce module est en cours de développement. Le contenu sera bientôt disponible."
    },
    example: {
        title: "Exemple",
        bad: { prompt: "...", response: "...", explanation: "..." },
        good: { prompt: "...", response: "...", explanation: "..." }
    },
    exercise: {
        instruction: "Exercice en préparation",
        badPrompt: "...",
        hint: "...",
        validationCriteria: [],
        exampleSolution: "..."
    }
});

export default function FormationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('concept');
    const [userAnswer, setUserAnswer] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const textareaRef = useRef(null);

    const moduleId = parseInt(id);
    const formation = formationsData[moduleId] || getDefaultFormation(moduleId);

    // Simulated user progress
    const userProgress = {
        currentLevel: 3,
        completedModules: [1, 2, 3]
    };

    const isUnlocked = moduleId <= userProgress.currentLevel + 1;
    const wasCompleted = userProgress.completedModules.includes(moduleId);

    useEffect(() => {
        if (!isUnlocked) {
            navigate('/formations');
        }
    }, [isUnlocked, navigate]);

    const validateAnswer = async () => {
        if (!userAnswer.trim()) return;

        setIsValidating(true);

        // Simulate AI validation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const answer = userAnswer.toLowerCase();
        const criteria = formation.exercise.validationCriteria;
        let score = 0;
        let feedback = [];

        // Check various criteria
        if (answer.length > 50) {
            score += 25;
            feedback.push({ text: "Prompt suffisamment détaillé", passed: true });
        } else {
            feedback.push({ text: "Prompt trop court, ajoutez plus de détails", passed: false });
        }

        if (answer.includes('contexte') || answer.includes('je suis') || answer.includes('mon') || answer.includes('notre')) {
            score += 25;
            feedback.push({ text: "Contexte personnel fourni", passed: true });
        } else {
            feedback.push({ text: "Ajoutez du contexte personnel", passed: false });
        }

        if (answer.includes('format') || answer.includes('liste') || answer.includes('étape') || answer.includes('tableau') || answer.includes('point')) {
            score += 25;
            feedback.push({ text: "Format de réponse spécifié", passed: true });
        } else {
            feedback.push({ text: "Précisez le format de réponse souhaité", passed: false });
        }

        if (answer.includes('?') || answer.includes('explique') || answer.includes('comment') || answer.includes('pourquoi') || answer.includes('compare')) {
            score += 25;
            feedback.push({ text: "Question ou instruction claire", passed: true });
        } else {
            feedback.push({ text: "Formulez une instruction plus claire", passed: false });
        }

        const passed = score >= 75;

        setValidationResult({
            passed,
            score,
            feedback,
            message: passed
                ? "Excellent travail ! Votre prompt est bien structuré et devrait obtenir une réponse pertinente de l'IA."
                : "Votre prompt peut être amélioré. Consultez les points à corriger ci-dessous."
        });

        if (passed) {
            setIsCompleted(true);
        }

        setIsValidating(false);
    };

    const goToNextModule = () => {
        navigate(`/formations/${moduleId + 1}`);
    };

    const tabs = [
        { id: 'concept', label: 'Concept', icon: 'solar:book-2-linear' },
        { id: 'example', label: 'Exemple', icon: 'solar:code-linear' },
        { id: 'exercise', label: 'Exercice', icon: 'solar:pen-new-square-linear' }
    ];

    return (
        <div className="bg-zinc-950 text-white min-h-screen antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                        <Link to="/formations" className="hover:text-white transition-colors">Formations</Link>
                        <Icon icon="solar:alt-arrow-right-linear" width="14" />
                        <span className="text-white">{formation.title}</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs px-2.5 py-1 rounded-full ${formation.difficulty === 'Débutant' ? 'bg-emerald-500/10 text-emerald-400' :
                                        formation.difficulty === 'Intermédiaire' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-orange-500/10 text-orange-400'
                                        }`}>
                                        {formation.difficulty}
                                    </span>
                                    <span className="text-sm text-zinc-500">{formation.category}</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                    {formation.title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <Icon icon="solar:clock-circle-linear" width="16" />
                                    <span>{formation.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Icon icon="solar:star-linear" width="16" className="text-amber-400" />
                                    <span>+{formation.xp} XP</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/50 w-fit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <Icon icon={tab.icon} width="18" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {/* Concept Tab */}
                        {activeTab === 'concept' && (
                            <motion.div
                                key="concept"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                            <Icon icon="solar:notebook-linear" width="22" className="text-violet-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-white">{formation.concept.title}</h2>
                                    </div>

                                    <div className="prose prose-invert prose-zinc max-w-none">
                                        {formation.concept.content.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="text-zinc-300 leading-relaxed mb-4 whitespace-pre-line">
                                                {paragraph.split('**').map((part, i) =>
                                                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                                                )}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Learn More Button */}
                                    {formation.concept.detailedContent && (
                                        <div className="mt-6 pt-6 border-t border-zinc-800/50">
                                            <button
                                                onClick={() => setShowDetailModal(true)}
                                                className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                                                    <Icon icon="solar:book-open-linear" width="18" className="text-violet-400" />
                                                </div>
                                                <span className="font-medium">En savoir plus</span>
                                                <Icon icon="solar:arrow-right-linear" width="16" className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <p className="mt-2 text-sm text-zinc-500 ml-10">
                                                Approfondir ce concept avec des explications détaillées
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setActiveTab('example')}
                                        className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Voir l'exemple
                                        <Icon icon="solar:arrow-right-linear" width="18" />
                                    </button>
                                </div>

                                {/* Detail Modal */}
                                <AnimatePresence>
                                    {showDetailModal && formation.concept.detailedContent && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
                                            onClick={() => setShowDetailModal(false)}
                                        >
                                            {/* Backdrop */}
                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                                            {/* Modal */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                                transition={{ type: "spring", duration: 0.5 }}
                                                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Modal Header */}
                                                <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 px-6 py-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                                                <Icon icon="solar:book-open-linear" width="22" className="text-violet-400" />
                                                            </div>
                                                            <div>
                                                                <h2 className="text-xl font-semibold text-white">
                                                                    {formation.concept.detailedContent.title}
                                                                </h2>
                                                                <p className="text-sm text-zinc-500">Exploration approfondie</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setShowDetailModal(false)}
                                                            className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                                                        >
                                                            <Icon icon="solar:close-circle-linear" width="22" className="text-zinc-400" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Modal Content */}
                                                <div className="overflow-y-auto p-6 space-y-8" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                                                    {formation.concept.detailedContent.sections.map((section, sectionIndex) => (
                                                        <motion.div
                                                            key={sectionIndex}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: sectionIndex * 0.1 }}
                                                            className="relative"
                                                        >
                                                            {/* Section Number */}
                                                            <div className="absolute -left-2 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                                                                {sectionIndex + 1}
                                                            </div>

                                                            <div className="ml-10">
                                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                                    {section.title}
                                                                </h3>
                                                                <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-5">
                                                                    <div className="prose prose-invert prose-zinc max-w-none">
                                                                        {section.content.split('\n\n').map((paragraph, pIndex) => (
                                                                            <p key={pIndex} className="text-zinc-300 leading-relaxed mb-3 last:mb-0 whitespace-pre-line text-sm">
                                                                                {paragraph.split('**').map((part, i) =>
                                                                                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                                                                                )}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    {/* Footer CTA */}
                                                    <div className="pt-6 border-t border-zinc-800/50  mb-10">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-zinc-500">
                                                                <Icon icon="solar:lightbulb-linear" width="16" className="inline mr-2 text-amber-400" />
                                                                Prêt à mettre en pratique ? Passez aux exemples et exercices.
                                                            </p>
                                                            <button
                                                                onClick={() => {
                                                                    setShowDetailModal(false);
                                                                    setActiveTab('example');
                                                                }}
                                                                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors"
                                                            >
                                                                Voir l'exemple
                                                                <Icon icon="solar:arrow-right-linear" width="16" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Example Tab */}
                        {activeTab === 'example' && (
                            <motion.div
                                key="example"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Bad Example */}
                                    <div className="bg-zinc-900/50 border border-red-500/20 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                                <Icon icon="solar:close-circle-bold" width="16" className="text-red-400" />
                                            </div>
                                            <span className="text-sm font-medium text-red-400">À éviter</span>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Prompt</span>
                                            <div className="mt-2 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                                                <p className="text-zinc-300 font-mono text-sm">{formation.example.bad.prompt}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Réponse IA</span>
                                            <div className="mt-2 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                                                <p className="text-zinc-400 text-sm">{formation.example.bad.response}</p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                            <p className="text-sm text-red-300">{formation.example.bad.explanation}</p>
                                        </div>
                                    </div>

                                    {/* Good Example */}
                                    <div className="bg-zinc-900/50 border border-emerald-500/20 rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                <Icon icon="solar:check-circle-bold" width="16" className="text-emerald-400" />
                                            </div>
                                            <span className="text-sm font-medium text-emerald-400">Bonne pratique</span>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Prompt</span>
                                            <div className="mt-2 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                                                <p className="text-zinc-300 font-mono text-sm whitespace-pre-line">{formation.example.good.prompt}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Réponse IA</span>
                                            <div className="mt-2 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                                                <p className="text-zinc-400 text-sm whitespace-pre-line">{formation.example.good.response}</p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                            <p className="text-sm text-emerald-300">{formation.example.good.explanation}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setActiveTab('exercise')}
                                        className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Passer à l'exercice
                                        <Icon icon="solar:arrow-right-linear" width="18" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Exercise Tab */}
                        {activeTab === 'exercise' && (
                            <motion.div
                                key="exercise"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                            <Icon icon="solar:pen-new-square-linear" width="22" className="text-amber-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-white">Exercice pratique</h2>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-zinc-300 text-lg mb-4">{formation.exercise.instruction}</p>

                                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 mb-4">
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Prompt à améliorer</span>
                                            <p className="text-red-400 font-mono">"{formation.exercise.badPrompt}"</p>
                                        </div>

                                        {/* Hint */}
                                        <button
                                            onClick={() => setShowHint(!showHint)}
                                            className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                                        >
                                            <Icon icon="solar:lightbulb-linear" width="16" />
                                            {showHint ? 'Masquer l\'indice' : 'Afficher un indice'}
                                        </button>

                                        <AnimatePresence>
                                            {showHint && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-3 p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl"
                                                >
                                                    <p className="text-sm text-violet-300">{formation.exercise.hint}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Answer Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                                            Votre prompt amélioré
                                        </label>
                                        <textarea
                                            ref={textareaRef}
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder="Écrivez votre prompt amélioré ici..."
                                            rows={6}
                                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none font-mono text-sm"
                                            disabled={isCompleted && !wasCompleted}
                                        />
                                    </div>

                                    {/* Validate Button */}
                                    {!isCompleted && (
                                        <button
                                            onClick={validateAnswer}
                                            disabled={!userAnswer.trim() || isValidating}
                                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                                        >
                                            {isValidating ? (
                                                <>
                                                    <Icon icon="solar:spinner-linear" width="18" className="animate-spin" />
                                                    Validation en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Icon icon="solar:check-circle-linear" width="18" />
                                                    Valider ma réponse
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Validation Result */}
                                    <AnimatePresence>
                                        {validationResult && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`mt-6 p-6 rounded-xl border ${validationResult.passed
                                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                                    : 'bg-amber-500/5 border-amber-500/20'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${validationResult.passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                                                        }`}>
                                                        <Icon
                                                            icon={validationResult.passed ? "solar:check-circle-bold" : "solar:info-circle-linear"}
                                                            width="28"
                                                            className={validationResult.passed ? 'text-emerald-400' : 'text-amber-400'}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className={`text-lg font-semibold mb-2 ${validationResult.passed ? 'text-emerald-400' : 'text-amber-400'
                                                            }`}>
                                                            {validationResult.passed ? 'Félicitations !' : 'Presque là !'}
                                                        </h3>
                                                        <p className="text-zinc-300 mb-4">{validationResult.message}</p>

                                                        <div className="space-y-2">
                                                            {validationResult.feedback.map((item, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <Icon
                                                                        icon={item.passed ? "solar:check-circle-bold" : "solar:close-circle-linear"}
                                                                        width="16"
                                                                        className={item.passed ? 'text-emerald-400' : 'text-red-400'}
                                                                    />
                                                                    <span className={`text-sm ${item.passed ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                                                        {item.text}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {validationResult.passed && (
                                                            <div className="mt-4 pt-4 border-t border-zinc-700/50 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Icon icon="solar:star-bold" width="20" className="text-amber-400" />
                                                                    <span className="text-amber-400 font-semibold">+{formation.xp} XP gagnés !</span>
                                                                </div>
                                                                {moduleId < 10 && (
                                                                    <button
                                                                        onClick={goToNextModule}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
                                                                    >
                                                                        Module suivant
                                                                        <Icon icon="solar:arrow-right-linear" width="16" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}

                                                        {!validationResult.passed && (
                                                            <div className="mt-4 pt-4 border-t border-zinc-700/50">
                                                                <button
                                                                    onClick={() => {
                                                                        setValidationResult(null);
                                                                        textareaRef.current?.focus();
                                                                    }}
                                                                    className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                                                                >
                                                                    <Icon icon="solar:refresh-linear" width="16" />
                                                                    Réessayer
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Example Solution (shown after completion or for review) */}
                                    {(isCompleted || wasCompleted) && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50"
                                        >
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Exemple de solution</span>
                                            <p className="text-zinc-300 font-mono text-sm whitespace-pre-line">{formation.exercise.exampleSolution}</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between">
                                    <Link
                                        to="/formations"
                                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <Icon icon="solar:arrow-left-linear" width="18" />
                                        Retour aux formations
                                    </Link>

                                    {wasCompleted && moduleId < 10 && (
                                        <button
                                            onClick={goToNextModule}
                                            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                                        >
                                            Module suivant
                                            <Icon icon="solar:arrow-right-linear" width="18" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
