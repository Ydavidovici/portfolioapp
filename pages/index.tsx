// pages/index.tsx
import Head from 'next/head';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectSection';
import ContactSection from '../components/ContactSection';
import ServicesSection from '../components/ServicesSection';

const Home: React.FC = () => {
    return (
        <div>
            <Head>
                <title>Yaakov Davidovici | Web Developer</title>
                <meta name="description" content="Portfolio of Yaakov Davidovici, a web developer specializing in JavaScript, PHP, and Python." />
            </Head>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <AboutSection />
                <SkillsSection />
                <ServicesSection />
                <ProjectsSection />
                <ContactSection />
            </main>
        </div>
    );
};

export default Home;
