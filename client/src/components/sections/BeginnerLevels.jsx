import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '../../hooks/useAnimations';

const modules = [
    {
        id: 1,
        title: "Introduction à l'IA",
        description: "Comprendre les fondamentaux des modèles de langage.",
        xp: 200,
        level: 1,
        status: 'completed',
    },
    {
        id: 2,
        title: "Reformulation de base",
        description: "Apprendre à reformuler vos demandes efficacement.",
        xp: 250,
        level: 2,
        status: 'completed',
    },
    {
        id: 3,
        title: "Questions intelligentes",
        description: "Formuler des questions claires et précises.",
        xp: 300,
        level: 3,
        status: 'in-progress',
        progress: 45,
    },
    {
        id: 4,
        title: "Extraction d'informations",
        description: "Extraire des données structurées des réponses IA.",
        xp: 350,
        level: 4,
        status: 'locked',
    },
    {
        id: 5,
        title: "Contexte et clarté",
        description: "Fournir le contexte optimal pour des réponses précises.",
        xp: 350,
        level: 5,
        status: 'locked',
    },
    {
        id: 6,
        title: "Instructions explicites",
        description: "Rédiger des instructions claires et non ambiguës.",
        xp: 400,
        level: 6,
        status: 'locked',
    },
];

function ModuleCard({ module }) {
    const isCompleted = module.status === 'completed';
    const isInProgress = module.status === 'in-progress';
    const isLocked = module.status === 'locked';

    if (isLocked) {
        return (
            <motion.div
                className="group bg-zinc-900/30 border border-zinc-800/30 rounded-xl p-5 opacity-60"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                        <Icon icon="solar:lock-linear" width="24" className="text-zinc-600" />
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-800/50 text-zinc-500 text-xs rounded-full">Verrouillé</span>
                </div>
                <h3 className="font-medium text-zinc-400 mb-2">{module.title}</h3>
                <p className="text-sm text-zinc-600 mb-4">{module.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="solar:star-linear" width="16" className="text-zinc-600" />
                        <span className="text-xs text-zinc-600">+{module.xp} XP</span>
                    </div>
                    <div className="text-xs text-zinc-600">Niveau {module.level}</div>
                </div>
            </motion.div>
        );
    }

    if (isInProgress) {
        return (
            <motion.div
                className="group bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/30 rounded-xl p-5 hover:border-violet-500/50 transition-all cursor-pointer"
                whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(139, 92, 246, 0.15)' }}
                transition={{ duration: 0.25 }}
            >
                <div className="flex items-start justify-between mb-4">
                    <motion.div
                        className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Icon icon="solar:play-linear" width="24" className="text-violet-400" />
                    </motion.div>
                    <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">En cours</span>
                </div>
                <h3 className="font-medium text-white mb-2">{module.title}</h3>
                <p className="text-sm text-zinc-400 mb-4">{module.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="solar:star-linear" width="16" className="text-amber-400" />
                        <span className="text-xs text-zinc-300">+{module.xp} XP</span>
                    </div>
                    <div className="text-xs text-zinc-400">Niveau {module.level}</div>
                </div>
                <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-violet-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${module.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="group bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/50 transition-all cursor-pointer"
            whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(16, 185, 129, 0.08)' }}
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Icon icon="solar:check-circle-bold" width="24" className="text-emerald-400" />
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">Complété</span>
            </div>
            <h3 className="font-medium text-white mb-2">{module.title}</h3>
            <p className="text-sm text-zinc-500 mb-4">{module.description}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon icon="solar:star-linear" width="16" className="text-amber-400" />
                    <span className="text-xs text-zinc-400">+{module.xp} XP</span>
                </div>
                <div className="text-xs text-zinc-500">Niveau {module.level}</div>
            </div>
        </motion.div>
    );
}

export default function BeginnerLevels() {
    return (
        <section id="parcours-section" className="sm:px-6 lg:px-8 pt-20 pr-4 pb-20 pl-4">
            <div className="max-w-6xl mr-auto ml-auto">
                {/* Header */}
                <FadeIn direction="left" delay={0}>
                    <div className="flex gap-3 mb-4 gap-x-3 gap-y-3 items-center">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">Niveau 1-10</span>
                        <span className="text-sm text-zinc-500">Cycle Débutant</span>
                    </div>
                </FadeIn>

                <FadeIn direction="left" delay={0.1}>
                    <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Fondamentaux du Prompt Engineering</h2>
                </FadeIn>

                <FadeIn direction="left" delay={0.15}>
                    <p className="text-zinc-400 mb-12 max-w-2xl">Maîtrisez les bases essentielles : reformulation, extraction d'informations et formulation de questions claires.</p>
                </FadeIn>

                {/* Progress Overview */}
                <FadeIn direction="up" delay={0.2}>
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Votre progression</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-semibold text-white">Niveau 3</span>
                                    <span className="text-sm text-zinc-500">/ 10</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-lg font-medium text-white">1,250</div>
                                    <div className="text-xs text-zinc-500">XP Total</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-medium text-white">5</div>
                                    <div className="text-xs text-zinc-500">Badges</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-medium text-emerald-400">72%</div>
                                    <div className="text-xs text-zinc-500">Réussite</div>
                                </div>
                            </div>
                        </div>

                        {/* Level Progress Bar */}
                        <div className="relative">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs text-zinc-500">Niveau 3</span>
                                <span className="text-xs text-zinc-500">Niveau 4</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '65%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-zinc-400">650 XP</span>
                                <span className="text-xs text-zinc-500">1000 XP</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Modules Grid */}
                <StaggerContainer
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    staggerDelay={0.1}
                    delayChildren={0.05}
                >
                    {modules.map((module) => (
                        <StaggerItem key={module.id} variant="scaleUp">
                            <ModuleCard module={module} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* View All Levels */}
                <FadeIn direction="up" delay={0.3}>
                    <div className="mt-8 text-center">
                        <motion.button
                            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            Voir tous les niveaux (7-10)
                            <Icon icon="solar:arrow-right-linear" width="16" />
                        </motion.button>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
