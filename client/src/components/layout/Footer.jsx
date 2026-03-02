import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StaggerContainer, StaggerItem, FadeIn } from '../../hooks/useAnimations';
import AppLogo from '../ui/AppLogo';

export default function Footer() {
    return (
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
                <StaggerContainer
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
                    staggerDelay={0.1}
                    delayChildren={0.05}
                >
                    <StaggerItem>
                        <div>
                            <div className="mb-4">
                                <AppLogo variant="dark" size="md" />
                            </div>
                            <p className="text-sm text-zinc-500">La première école numérique francophone spécialisée en IA.</p>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <nav aria-label="Parcours de formation">
                            <div className="text-sm font-medium text-white mb-4">Parcours</div>
                            <ul className="space-y-2">
                                <li><Link to="/formations" className="text-sm text-zinc-500 hover:text-white transition-colors">Débutant</Link></li>
                                <li><Link to="/formations" className="text-sm text-zinc-500 hover:text-white transition-colors">Intermédiaire</Link></li>
                                <li><Link to="/formations" className="text-sm text-zinc-500 hover:text-white transition-colors">Avancé</Link></li>
                                <li><Link to="/formations" className="text-sm text-zinc-500 hover:text-white transition-colors">Expert</Link></li>
                            </ul>
                        </nav>
                    </StaggerItem>
                    <StaggerItem>
                        <nav aria-label="Ressources">
                            <div className="text-sm font-medium text-white mb-4">Ressources</div>
                            <ul className="space-y-2">
                                <li><Link to="/store-pro" className="text-sm text-zinc-500 hover:text-white transition-colors">Store Pro</Link></li>
                                <li><Link to="/suggestions" className="text-sm text-zinc-500 hover:text-white transition-colors">Suggestions</Link></li>
                                <li><Link to="/signup" className="text-sm text-zinc-500 hover:text-white transition-colors">Inscription</Link></li>
                                <li><Link to="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">Connexion</Link></li>
                            </ul>
                        </nav>
                    </StaggerItem>
                    <StaggerItem>
                        <nav aria-label="Entreprise">
                            <div className="text-sm font-medium text-white mb-4">Entreprise</div>
                            <ul className="space-y-2">
                                <li><a href="mailto:contact@promptacademy.com" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact</a></li>
                                <li><Link to="/suggestions" className="text-sm text-zinc-500 hover:text-white transition-colors">Retours & Idées</Link></li>
                            </ul>
                        </nav>
                    </StaggerItem>
                </StaggerContainer>

                <FadeIn direction="up" delay={0.2}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-800/50">
                        <div className="text-sm text-zinc-500">© 2026 PromptAcademy. Tous droits réservés.</div>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: 'solar:twitter-linear', href: '#', label: 'Twitter' },
                                { icon: 'solar:play-circle-linear', href: '#', label: 'YouTube' },
                                { icon: 'solar:link-circle-linear', href: '#', label: 'LinkedIn' },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="text-zinc-500 hover:text-white transition-colors"
                                    whileHover={{ scale: 1.2, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Icon icon={social.icon} width="20" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </footer>
    );
}
