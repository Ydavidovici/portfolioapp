import React from 'react';
import Button from './Button';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="py-16 bg-jet text-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Davidovici Software</h1>
        <p className="text-lg mb-8">
          Professional consulting services specializing in web development, e-commerce solutions, API development, and more.
        </p>
        <Button href="#contact" text="Get in Touch" />
      </div>
    </section>
  );
};

export default HeroSection;
