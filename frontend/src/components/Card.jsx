// src/commonComponents/common/Card.jsx
import React from 'react';

const Card = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = "p-12 rounded-45px shadow-custom border transition-transform transform hover:scale-105";
  const variantClasses = {
    default: "bg-gray-100 border-dark",
    highlighted: "bg-primary border-primary",
    dark: "bg-dark text-white border-dark",
    // Add other variants as needed
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
