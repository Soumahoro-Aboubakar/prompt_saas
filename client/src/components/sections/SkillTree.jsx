import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { FadeIn } from '../../hooks/useAnimations';

export default function SkillTree() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Arbre de compétences</h2>
                        <p className="text-zinc-400">Visualisez et débloquez vos compétences progressivement</p>
                    </div>
                </FadeIn>

                {/* Skill Tree Visual */}
                <FadeIn direction="up" delay={0.15}>
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 overflow-x-auto">
                        <div className="flex flex-col items-center min-w-max">
                            {/* Level 1 — Root */}
                            <motion.div
                                className="flex items-center gap-4 mb-8"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                <motion.div
                                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Icon icon="solar:star-bold" width="28" className="text-white" />
                                </motion.div>
                            </motion.div>

                            {/* Connector Line 1 */}
                            <motion.div
                                className="w-px bg-gradient-to-b from-emerald-500 to-violet-500"
                                initial={{ height: 0 }}
                                whileInView={{ height: 32 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                            />

                            {/* Level 2-3 */}
                            <motion.div
                                className="flex items-center gap-16 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                <motion.div
                                    className="flex flex-col items-center"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <Icon icon="solar:document-text-linear" width="24" className="text-white" />
                                    </div>
                                    <span className="text-xs text-zinc-400 mt-2">Reformulation</span>
                                </motion.div>
                                <motion.div
                                    className="flex flex-col items-center"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-2 ring-violet-400 ring-offset-2 ring-offset-zinc-900"
                                        animate={{ boxShadow: ['0 10px 15px rgba(139,92,246,0.2)', '0 10px 25px rgba(139,92,246,0.4)', '0 10px 15px rgba(139,92,246,0.2)'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Icon icon="solar:chat-round-dots-linear" width="24" className="text-white" />
                                    </motion.div>
                                    <span className="text-xs text-violet-400 mt-2">Questions</span>
                                </motion.div>
                            </motion.div>

                            {/* Connector Lines 2 */}
                            <motion.div
                                className="flex gap-32"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 1 }}
                            >
                                <motion.div
                                    className="w-px bg-zinc-700"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 32 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 1 }}
                                />
                                <motion.div
                                    className="w-px bg-zinc-700"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 32 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 1.1 }}
                                />
                            </motion.div>

                            {/* Level 4-6 — Locked */}
                            <motion.div
                                className="flex items-center gap-8 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                            >
                                {['Extraction', 'Contexte', 'Instructions'].map((label, i) => (
                                    <motion.div
                                        key={label}
                                        className="flex flex-col items-center opacity-50"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 0.5, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 1.3 + i * 0.1 }}
                                        whileHover={{ opacity: 0.7 }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                            <Icon icon="solar:lock-linear" width="20" className="text-zinc-600" />
                                        </div>
                                        <span className="text-xs text-zinc-600 mt-2">{label}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
