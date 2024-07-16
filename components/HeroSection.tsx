// components/HeroSection.tsx
const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="hero bg-gray-800 text-white py-16">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Davidovici Software</h1>
        <p className="text-lg mb-8">
          Professional consulting services specializing in web development,
          e-commerce solutions, API development, and more.
        </p>
        <a
          href="#contact"
          className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
