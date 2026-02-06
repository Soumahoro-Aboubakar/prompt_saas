import { Icon } from '@iconify/react';

export default function Footer() {
    return (
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="text-lg font-semibold tracking-tight text-white mb-4">
                            <span className="text-violet-500">✦</span> prompt<span className="text-violet-500">academy</span>
                        </div>
                        <p className="text-sm text-zinc-500">La première école numérique francophone spécialisée en IA.</p>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white mb-4">Parcours</div>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Débutant</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Intermédiaire</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Avancé</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Expert</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white mb-4">Ressources</div>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white mb-4">Entreprise</div>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">À propos</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Partenariats</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Carrières</a></li>
                            <li><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-800/50">
                    <div className="text-sm text-zinc-500">© 2025 PromptAcademy. Tous droits réservés.</div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="solar:twitter-linear" width="20" />
                        </a>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="solar:play-circle-linear" width="20" />
                        </a>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="solar:link-circle-linear" width="20" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
