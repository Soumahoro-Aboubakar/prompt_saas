import { Icon } from '@iconify/react';

export default function SkillTree() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Arbre de compétences</h2>
                    <p className="text-zinc-400">Visualisez et débloquez vos compétences progressivement</p>
                </div>

                {/* Skill Tree Visual */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 overflow-x-auto">
                    <div className="flex flex-col items-center min-w-max">
                        {/* Level 1 */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Icon icon="solar:star-bold" width="28" className="text-white" />
                            </div>
                        </div>

                        <div className="w-px h-8 bg-gradient-to-b from-emerald-500 to-violet-500"></div>

                        {/* Level 2-3 */}
                        <div className="flex items-center gap-16 mb-8">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Icon icon="solar:document-text-linear" width="24" className="text-white" />
                                </div>
                                <span className="text-xs text-zinc-400 mt-2">Reformulation</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-2 ring-violet-400 ring-offset-2 ring-offset-zinc-900">
                                    <Icon icon="solar:chat-round-dots-linear" width="24" className="text-white" />
                                </div>
                                <span className="text-xs text-violet-400 mt-2">Questions</span>
                            </div>
                        </div>

                        <div className="flex gap-32">
                            <div className="w-px h-8 bg-zinc-700"></div>
                            <div className="w-px h-8 bg-zinc-700"></div>
                        </div>

                        {/* Level 4-6 */}
                        <div className="flex items-center gap-8 mb-8">
                            <div className="flex flex-col items-center opacity-50">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                    <Icon icon="solar:lock-linear" width="20" className="text-zinc-600" />
                                </div>
                                <span className="text-xs text-zinc-600 mt-2">Extraction</span>
                            </div>
                            <div className="flex flex-col items-center opacity-50">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                    <Icon icon="solar:lock-linear" width="20" className="text-zinc-600" />
                                </div>
                                <span className="text-xs text-zinc-600 mt-2">Contexte</span>
                            </div>
                            <div className="flex flex-col items-center opacity-50">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                    <Icon icon="solar:lock-linear" width="20" className="text-zinc-600" />
                                </div>
                                <span className="text-xs text-zinc-600 mt-2">Instructions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
