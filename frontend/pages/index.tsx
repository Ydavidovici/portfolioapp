import Head from 'next/head';
import Header from '../components/header';
import AboutSection from '../components/aboutSection';
import SkillsSection from '../components/skillsSection';
import ProjectsSection from '../components/projectSection';
import ContactSection from '../components/contactSection';

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
                <ProjectsSection />
                <ContactSection />
            </main>
        </div>
    );
};

export default Home;
