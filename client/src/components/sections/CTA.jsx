import { Icon } from '@iconify/react';

export default function CTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 border border-violet-500/20 rounded-3xl p-12">
                    <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Prêt à maîtriser l'IA ?</h2>
                    <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Rejoignez des milliers d'apprenants et commencez votre parcours vers l'expertise en Prompt Engineering.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto px-8 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-100 transition-colors">
                            Démarrer gratuitement
                        </button>
                        <button className="w-full sm:w-auto px-8 py-3 border border-zinc-600 text-white font-medium rounded-lg hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-2">
                            <Icon icon="solar:play-circle-linear" width="20" />
                            Voir la démo
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
