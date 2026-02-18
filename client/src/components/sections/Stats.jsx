import { motion } from 'framer-motion';
import { CountUp, StaggerContainer, StaggerItem } from '../../hooks/useAnimations';

export default function Stats() {
    const stats = [
        { value: '12K+', numericValue: 12000, suffix: '+', label: 'Apprenants actifs' },
        { value: '100', numericValue: 100, suffix: '', label: 'Niveaux progressifs' },
        { value: '850+', numericValue: 850, suffix: '+', label: 'Diplômés' },
        { value: '45', numericValue: 45, suffix: '', label: 'Pays représentés' },
    ];

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-zinc-800/50">
            <StaggerContainer
                className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
                staggerDelay={0.12}
                delayChildren={0.05}
            >
                {stats.map((stat, index) => (
                    <StaggerItem key={index} className="text-center">
                        <motion.div
                            className="text-3xl font-semibold tracking-tight text-white"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <CountUp
                                end={stat.numericValue}
                                suffix={stat.suffix}
                                prefix={stat.numericValue >= 1000 ? '' : ''}
                                duration={2}
                            />
                        </motion.div>
                        <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
}
