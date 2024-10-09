// src/components/common/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} Davidovici Software. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
