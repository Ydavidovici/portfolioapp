import React from 'react';
import ScrollIndicator from './ScrollIndicator';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="parallax flex items-center justify-center text-white text-center relative">
      <div>
        <h1 className="text-5xl font-bold">Welcome to Davidovici Software</h1>
        <p className="mt-4 text-lg">Your partner in web development and consulting.</p>
      </div>
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
