// components/HeroSection.tsx

const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="flex items-center justify-center text-white text-center relative"
      style={{ paddingTop: '6rem' }}
    >
      <div>
        <h1 className="text-5xl font-bold">Welcome to Davidovici Software</h1>
        <p className="mt-4 text-lg">
          Your partner in web development and consulting.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
