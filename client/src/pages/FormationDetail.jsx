import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { validateAnswer as aiValidateAnswer } from '../services/validateService';

// Import the formation service for dynamic data loading
import { getFormationOrDefault, getLevelForModule, getFormationsCount } from '../services/formationService';

// Import sync and progress hooks/contexts
import { useProgress } from '../context/ProgressContext';
import useSyncProgress from '../hooks/useSyncProgress';
import { useToast } from '../components/ui/Toast';
import OnboardingModal from '../components/ui/OnboardingModal';

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

    // Dynamically load formation data from JSON files based on module ID
    const formation = getFormationOrDefault(moduleId);
    const formationLevel = getLevelForModule(moduleId);
    const totalFormations = getFormationsCount();

    // Use progress context instead of hardcoded values
    const { currentLevel, isModuleCompleted, optimisticComplete } = useProgress();
    const { syncModuleCompletion, pendingSync, syncError, clearError } = useSyncProgress();
    const toast = useToast();

    // Rollback function reference
    const rollbackRef = useRef(null);
    const navigatedRef = useRef(false);

    const isUnlocked = moduleId <= currentLevel;
    const wasCompleted = isModuleCompleted(moduleId);

    useEffect(() => {
        if (!isUnlocked) {
            navigate('/formations');
        }
    }, [isUnlocked, navigate]);

    // Reset state when module changes
    useEffect(() => {
        setActiveTab('concept');
        setUserAnswer('');
        setValidationResult(null);
        setShowHint(false);
        setIsCompleted(false);
        setShowDetailModal(false);
        navigatedRef.current = false;
        clearError();
    }, [moduleId, clearError]);

    const validateAnswer = async () => {
        if (!userAnswer.trim()) return;

        setIsValidating(true);
        setValidationResult(null);

        try {
            const response = await aiValidateAnswer(
                moduleId,
                userAnswer,
                formation.exercise,
                formation.title
            );

            if (!response.success) {
                throw new Error(response.message || 'Validation failed');
            }

            const { score, passed, feedback, message } = response.data;

            setValidationResult({
                passed,
                score,
                feedback: feedback || [],
                message: message || (passed
                    ? "Excellent travail ! Votre prompt est bien structuré."
                    : "Votre prompt peut être amélioré.")
            });

            if (passed) {
                setIsCompleted(true);

                // Optimistic update - store rollback function
                rollbackRef.current = optimisticComplete(moduleId, score);

                // Show success toast immediately
                toast.success(`+${formation.xp} XP gagnés !`, {
                    title: 'Module validé !'
                });

                // Sync with backend in background
                syncModuleCompletion(moduleId, score, formation.xp).then(result => {
                    if (!result.success) {
                        if (result.canceled) return;

                        if (rollbackRef.current) {
                            rollbackRef.current();
                            rollbackRef.current = null;
                        }

                        setIsCompleted(false);

                        toast.error('Serveur indisponible, progression non enregistrée', {
                            title: 'Erreur de synchronisation',
                            duration: 8000,
                            action: {
                                label: 'Réessayer',
                                onClick: () => validateAnswer()
                            }
                        });

                        if (navigatedRef.current) {
                            navigate(`/formations/${moduleId}`);
                            navigatedRef.current = false;
                        }
                        return;
                    }

                    if (Array.isArray(result.data?.stats?.newBadges) && result.data.stats.newBadges.length > 0) {
                        const count = result.data.stats.newBadges.length;
                        toast.success(`${count} nouveau${count > 1 ? 'x' : ''} badge${count > 1 ? 's' : ''} débloqué${count > 1 ? 's' : ''} !`, {
                            title: 'Récompense'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Validation error:', error);
            setValidationResult({
                passed: false,
                score: 0,
                feedback: [],
                message: 'Erreur lors de la validation. Veuillez réessayer.'
            });
        } finally {
            setIsValidating(false);
        }
    };


    const goToNextModule = () => {
        navigatedRef.current = true;
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
                        <span className="text-zinc-400">{formationLevel}</span>
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

                                        <div>
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
                                    {!isCompleted && !wasCompleted && (
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
                                                                {moduleId < totalFormations && (
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

                                    {wasCompleted && moduleId < totalFormations && (
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

            {/* Onboarding Modal */}
            <OnboardingModal routeKey="/formations/:id" />
        </div>
    );
}
