// src/components/common/LoadingSpinner.jsx

import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({
  size = 'md',
  color = 'text-gray-500',
  ariaLabel = 'Loading',
}) => {
  let spinnerSizeClasses = '';
  switch (size) {
    case 'sm':
      spinnerSizeClasses = 'w-4 h-4';
      break;
    case 'md':
      spinnerSizeClasses = 'w-8 h-8';
      break;
    case 'lg':
      spinnerSizeClasses = 'w-12 h-12';
      break;
    default:
      spinnerSizeClasses = 'w-8 h-8';
  }

  return (
    <div role="status" aria-label={ariaLabel}>
      <svg
        className={`animate-spin ${spinnerSizeClasses} ${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default LoadingSpinner;
