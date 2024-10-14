// src/commonComponents/common/Header.jsx
import React, { useState } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import NavigationLink from './NavigationLink';
import { useLocation } from 'react-router-dom';

const Header = ({ title, logoSrc, navLinks, buttonText, onButtonClick, variant }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className={`flex justify-between items-center px-6 md:px-24 py-6 shadow ${
      variant === 'admin' ? 'bg-gray-800 text-white' : 'bg-white text-black'
    }`}>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {logoSrc && (
          <div className="w-9 h-9 relative">
            <img src={logoSrc} alt="Logo" className="w-full h-full" />
          </div>
        )}
      </div>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-xl focus:outline-none">
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Navigation Links */}
      <nav className={`md:flex ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col md:flex-row md:space-x-10 mt-4 md:mt-0">
          {navLinks.map((link, index) => (
            <li key={index} className="mb-2 md:mb-0">
              <NavigationLink
                href={link.href}
                text={link.text}
                isActive={location.pathname === link.href}
                variant={variant}
              />
            </li>
          ))}
          {buttonText && (
            <li className="mt-2 md:mt-0">
              <Button variant={variant === 'admin' ? 'secondary' : 'primary'} onClick={onButtonClick}>
                {buttonText}
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  logoSrc: PropTypes.string,
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  variant: PropTypes.oneOf(['public', 'admin']),
};

Header.defaultProps = {
  logoSrc: null,
  buttonText: null,
  onButtonClick: () => {},
  variant: 'public',
};

export default Header;
