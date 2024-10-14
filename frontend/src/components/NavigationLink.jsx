// src/commonComponents/common/NavigationLink.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const NavigationLink = ({ to, text, variant }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-xl font-normal underline-offset-2 ${
          isActive
            ? variant === 'admin'
              ? 'underline text-[#b9ff66]'
              : 'underline text-primary'
            : variant === 'admin'
              ? 'text-white hover:text-gray-300'
              : 'text-black hover:text-gray-700'
        }`
      }
    >
      {text}
    </NavLink>
  );
};

NavigationLink.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['public', 'admin']),
};

NavigationLink.defaultProps = {
  variant: 'public',
};

export default NavigationLink;
