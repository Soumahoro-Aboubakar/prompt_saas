import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

// Import the formation service for dynamic data loading
import { getAllFormations } from '../services/formationService';

// Import contexts for real data
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

// Icon mapping for modules based on their content
const moduleIcons = {
    1: "solar:atom-linear",
    2: "solar:document-text-linear",
    3: "solar:pen-new-square-linear",
    4: "solar:chat-round-dots-linear",
    5: "solar:user-speak-linear",
    6: "solar:route-linear",
    7: "solar:copy-linear",
    8: "solar:database-linear",
    9: "solar:magic-stick-3-linear",
    10: "solar:code-square-linear"
};

// Default icon for modules without specific icon
const getModuleIcon = (moduleId) => moduleIcons[moduleId] || "solar:book-linear";

export default function Formations() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Get real user data from contexts
    const { stats } = useAuth();
    const { completedModules, currentLevel, loading, isModuleCompleted, isModuleUnlocked } = useProgress();

    // Load formations dynamically from JSON files
    const formations = useMemo(() => {
        const allFormations = getAllFormations();

        // Add icons and descriptions to formations
        return allFormations.map(formation => ({
            ...formation,
            icon: getModuleIcon(formation.id),
            // Generate description from concept content (first 120 chars)
            description: formation.concept?.content
                ? formation.concept.content
                    .replace(/\*\*/g, '')
                    .replace(/\n/g, ' ')
                    .substring(0, 120) + '...'
                : 'Module de formation en prompt engineering.'
        }));
    }, []);

    // Get total XP from stats
    const totalXP = stats?.totalXP || 0;

    const getModuleStatus = (moduleId) => {
        if (isModuleCompleted(moduleId)) return 'completed';
        if (isModuleUnlocked(moduleId)) return 'unlocked';
        return 'locked';
    };

    const handleModuleClick = (module) => {
        if (isModuleUnlocked(module.id)) {
            navigate(`/formations/${module.id}`);
        }
    };

    // Group formations by category
    const groupedFormations = useMemo(() => {
        return formations.reduce((acc, formation) => {
            const category = formation.category || 'Autres';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(formation);
            return acc;
        }, {});
    }, [formations]);

    const completionPercentage = formations.length > 0
        ? Math.round((completedModules.length / formations.length) * 100)
        : 0;

    if (loading) {
        return (
            <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 text-white min-h-screen antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
                                    Mes formations
                                </h1>
                                <p className="text-zinc-400">
                                    Progressez à votre rythme et maîtrisez l'art du prompting
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="solar:star-bold" width="18" className="text-violet-400" />
                                        <span className="text-sm font-medium text-violet-400">{totalXP.toLocaleString()} XP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Overview */}
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-lg font-medium text-white mb-1">Progression globale</h2>
                                    <p className="text-sm text-zinc-500">
                                        {completedModules.length} modules complétés sur {formations.length}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-white">{completionPercentage}%</span>
                                </div>
                            </div>
                            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Formations by Category */}
                    <div className="space-y-8">
                        {Object.entries(groupedFormations).map(([category, categoryFormations]) => (
                            <div key={category}>
                                <div className="flex items-center gap-3 mb-4">
                                    <h2 className="text-lg font-semibold text-white">{category}</h2>
                                    <div className="flex-1 h-px bg-zinc-800"></div>
                                    <span className="text-sm text-zinc-500">
                                        {categoryFormations.filter(f => isModuleCompleted(f.id)).length}/{categoryFormations.length}
                                    </span>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryFormations.map((formation, index) => {
                                        const status = getModuleStatus(formation.id);

                                        return (
                                            <motion.div
                                                key={formation.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleModuleClick(formation)}
                                                className={`relative bg-zinc-900/50 border rounded-2xl p-5 transition-all duration-300 ${status === 'locked'
                                                    ? 'border-zinc-800/50 opacity-60 cursor-not-allowed'
                                                    : status === 'completed'
                                                        ? 'border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer hover:bg-zinc-900/80'
                                                        : 'border-violet-500/30 hover:border-violet-500/50 cursor-pointer hover:bg-zinc-900/80'
                                                    }`}
                                            >
                                                {/* Status Badge */}
                                                <div className="absolute top-4 right-4">
                                                    {status === 'completed' && (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                            <Icon icon="solar:check-circle-bold" width="20" className="text-emerald-400" />
                                                        </div>
                                                    )}
                                                    {status === 'locked' && (
                                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                            <Icon icon="solar:lock-keyhole-bold" width="18" className="text-zinc-500" />
                                                        </div>
                                                    )}
                                                    {status === 'unlocked' && (
                                                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                            <Icon icon="solar:play-bold" width="16" className="text-violet-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Icon */}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${status === 'completed'
                                                    ? 'bg-emerald-500/10'
                                                    : status === 'unlocked'
                                                        ? 'bg-violet-500/10'
                                                        : 'bg-zinc-800/50'
                                                    }`}>
                                                    <Icon
                                                        icon={formation.icon}
                                                        width="24"
                                                        className={
                                                            status === 'completed'
                                                                ? 'text-emerald-400'
                                                                : status === 'unlocked'
                                                                    ? 'text-violet-400'
                                                                    : 'text-zinc-600'
                                                        }
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="pr-10">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${formation.difficulty === 'Débutant' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            formation.difficulty === 'Intermédiaire' ? 'bg-amber-500/10 text-amber-400' :
                                                                formation.difficulty === 'Avancé' ? 'bg-orange-500/10 text-orange-400' :
                                                                    'bg-red-500/10 text-red-400'
                                                            }`}>
                                                            {formation.difficulty}
                                                        </span>
                                                        <span className="text-xs text-zinc-500">Module {formation.id}</span>
                                                    </div>
                                                    <h3 className={`font-medium mb-2 ${status === 'locked' ? 'text-zinc-500' : 'text-white'}`}>
                                                        {formation.title}
                                                    </h3>
                                                    <p className={`text-sm mb-4 line-clamp-2 ${status === 'locked' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                                        {formation.description}
                                                    </p>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <Icon icon="solar:clock-circle-linear" width="14" className="text-zinc-500" />
                                                            <span className="text-xs text-zinc-500">{formation.duration}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Icon icon="solar:star-linear" width="14" className="text-amber-400" />
                                                            <span className="text-xs text-zinc-400">+{formation.xp} XP</span>
                                                        </div>
                                                    </div>
                                                    {status !== 'locked' && (
                                                        <span className={`text-xs font-medium ${status === 'completed' ? 'text-emerald-400' : 'text-violet-400'
                                                            }`}>
                                                            {status === 'completed' ? 'Revoir' : 'Commencer'}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state if no formations */}
                    {formations.length === 0 && (
                        <div className="text-center py-16">
                            <Icon icon="solar:book-bookmark-linear" width="64" className="text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">Aucune formation disponible</h3>
                            <p className="text-zinc-500">Les formations seront bientôt disponibles.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
