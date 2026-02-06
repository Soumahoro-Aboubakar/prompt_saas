import { Icon } from '@iconify/react';

export default function AIMentor() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/30 border-y border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 mb-6">
                            <Icon icon="solar:magic-stick-linear" width="14" />
                            Mentor IA Personnel
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Votre assistant d'apprentissage intelligent</h2>
                        <p className="text-zinc-400 mb-8">Un mentor IA disponible 24/7 pour corriger vos prompts, expliquer les concepts et vous guider vers la maîtrise.</p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="solar:check-read-linear" width="18" className="text-emerald-400" />
                                </div>
                                <div>
                                    <div className="font-medium text-white text-sm">Correction instantanée</div>
                                    <div className="text-sm text-zinc-500">Analyse et amélioration de vos prompts en temps réel</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="solar:lightbulb-linear" width="18" className="text-blue-400" />
                                </div>
                                <div>
                                    <div className="font-medium text-white text-sm">Suggestions intelligentes</div>
                                    <div className="text-sm text-zinc-500">Recommandations personnalisées basées sur votre niveau</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="solar:chart-linear" width="18" className="text-amber-400" />
                                </div>
                                <div>
                                    <div className="font-medium text-white text-sm">Suivi de progression</div>
                                    <div className="text-sm text-zinc-500">Analyse détaillée de vos forces et axes d'amélioration</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Interface Preview */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                <Icon icon="solar:cpu-bolt-linear" width="16" className="text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Mentor IA</div>
                                <div className="text-xs text-emerald-400">En ligne</div>
                            </div>
                        </div>
                        <div className="p-4 space-y-4 h-80 overflow-y-auto">
                            {/* User Message */}
                            <div className="flex justify-end">
                                <div className="bg-violet-600 rounded-2xl rounded-br-md px-4 py-2 max-w-xs">
                                    <p className="text-sm text-white">Comment puis-je améliorer ce prompt : "Donne moi des idées" ?</p>
                                </div>
                            </div>
                            {/* AI Response */}
                            <div className="flex justify-start">
                                <div className="bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3 max-w-sm">
                                    <p className="text-sm text-zinc-200 mb-3">Excellent exemple ! Votre prompt manque de contexte. Voici une version améliorée :</p>
                                    <div className="bg-zinc-900 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-emerald-400 font-mono">"Donne-moi 5 idées créatives de projets en Python pour un débutant, avec une brève description de chaque projet."</p>
                                    </div>
                                    <p className="text-sm text-zinc-400">Cette version inclut : quantité, sujet, niveau et format attendu.</p>
                                </div>
                            </div>
                            {/* User Message */}
                            <div className="flex justify-end">
                                <div className="bg-violet-600 rounded-2xl rounded-br-md px-4 py-2 max-w-xs">
                                    <p className="text-sm text-white">Merci ! Quelles autres techniques puis-je utiliser ?</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-zinc-800">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Posez votre question..."
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                                />
                                <button className="w-10 h-10 bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center justify-center transition-colors">
                                    <Icon icon="solar:plain-linear" width="18" className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
