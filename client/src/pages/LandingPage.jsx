import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Background from '../components/sections/Background';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import BeginnerLevels from '../components/sections/BeginnerLevels';
import AIMentor from '../components/sections/AIMentor';
import SkillTree from '../components/sections/SkillTree';
import Badges from '../components/sections/Badges';
import CTA from '../components/sections/CTA';

export default function LandingPage() {
    return (
        <div className="text-white font-sans antialiased min-h-screen relative overflow-hidden">

            <Background />
            <Navbar />
            <main>
                <Hero />
                <Stats />
                <BeginnerLevels />
                <AIMentor />
                <SkillTree />
                <Badges />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
