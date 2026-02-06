import { Icon } from '@iconify/react';

export default function Hero() {
    return (
        <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="bg-gradient-to-b from-violet-600/10 via-transparent to-transparent absolute top-0 right-0 bottom-0 left-0"></div>
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto text-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400 mb-6">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Nouvelle session disponible
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6">
                    Devenez un expert en <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Prompt Engineering</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-2xl mr-auto mb-10 ml-auto">
                    La première école numérique francophone spécialisée dans la maîtrise de l'IA. Formations pratiques, mentor IA personnel et parcours adaptatif.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2">
                        <Icon icon="solar:play-linear" width="20" style={{ strokeWidth: 1.5 }} />
                        Commencer le diagnostic
                    </button>
                    <button className="w-full sm:w-auto px-6 py-3 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800/50 transition-colors">
                        Voir les parcours
                    </button>
                </div>
            </div>
        </section>
    );
}
