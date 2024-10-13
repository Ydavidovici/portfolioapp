// src/commonComponents/common/Button.jsx
import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-8 py-2 rounded-14px focus:ring-offset-2 transition-colors duration-300";
  const variantClasses = {
    primary: "bg-primary text-black hover:bg-[#a1e654] focus:ring-primary",
    secondary: "bg-dark text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-700 focus:ring-red-500",
    // Add other variants as needed
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
