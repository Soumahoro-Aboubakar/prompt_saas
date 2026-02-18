import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '../../hooks/useAnimations';

const badges = [
    {
        id: 1,
        name: 'Premier pas',
        description: 'Niveau 1',
        icon: 'solar:rocket-linear',
        gradient: 'from-amber-400 to-orange-500',
        shadow: 'shadow-amber-500/20',
        unlocked: true,
    },
    {
        id: 2,
        name: 'Reformulateur',
        description: '10 prompts',
        icon: 'solar:pen-new-square-linear',
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'shadow-emerald-500/20',
        unlocked: true,
    },
    {
        id: 3,
        name: 'Série de 3',
        description: '3 jours',
        icon: 'solar:fire-linear',
        gradient: 'from-blue-400 to-indigo-500',
        shadow: 'shadow-blue-500/20',
        unlocked: true,
    },
    {
        id: 4,
        name: 'Quiz Master',
        description: '100% quiz',
        icon: 'solar:diploma-linear',
        gradient: 'from-violet-400 to-purple-500',
        shadow: 'shadow-violet-500/20',
        unlocked: true,
    },
    {
        id: 5,
        name: 'Curieux',
        description: '5 questions',
        icon: 'solar:heart-linear',
        gradient: 'from-rose-400 to-pink-500',
        shadow: 'shadow-rose-500/20',
        unlocked: true,
    },
    {
        id: 6,
        name: '???',
        description: 'Verrouillé',
        icon: 'solar:lock-linear',
        unlocked: false,
    },
];

function BadgeCard({ badge }) {
    if (!badge.unlocked) {
        return (
            <div className="flex flex-col items-center p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 opacity-40">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                    <Icon icon={badge.icon} width="24" className="text-zinc-600" />
                </div>
                <span className="text-sm font-medium text-zinc-500">{badge.name}</span>
                <span className="text-xs text-zinc-600">{badge.description}</span>
            </div>
        );
    }

    return (
        <motion.div
            className="flex flex-col items-center p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50"
            whileHover={{
                scale: 1.08,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.3 },
            }}
        >
            <motion.div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center mb-3 shadow-lg ${badge.shadow}`}
                whileHover={{
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
                }}
            >
                <Icon icon={badge.icon} width="28" className="text-white" />
            </motion.div>
            <span className="text-sm font-medium text-white">{badge.name}</span>
            <span className="text-xs text-zinc-500">{badge.description}</span>
        </motion.div>
    );
}

export default function Badges() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/30 border-y border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
                <FadeIn direction="up">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Vos badges</h2>
                            <p className="text-zinc-400">Collectionnez des badges en complétant les défis</p>
                        </div>
                        <div className="text-sm text-zinc-500">5 / 24 badges débloqués</div>
                    </div>
                </FadeIn>

                <StaggerContainer
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    staggerDelay={0.1}
                    delayChildren={0.1}
                >
                    {badges.map((badge) => (
                        <StaggerItem key={badge.id} variant="pop">
                            <BadgeCard badge={badge} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
