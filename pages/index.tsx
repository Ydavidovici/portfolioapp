import Head from 'next/head';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectSection';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Davidovici Software</title>
        <meta
          name="description"
          content="Professional consulting services by Davidovici Software. Specializing in web development, e-commerce solutions, API development, and more."
        />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Home;
