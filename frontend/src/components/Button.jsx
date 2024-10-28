import React from 'react';
// import './Button.css'; // Optional: For styling

const Button = ({ variant, type = 'button', onClick, children, ...props }) => {
  const baseStyles =
    'px-4 py-2 rounded focus:outline-none focus:shadow-outline';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700',
    secondary: 'bg-gray-500 text-white hover:bg-gray-700',
    danger: 'bg-red-500 text-white hover:bg-red-700',
    // Add more variants as needed
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
