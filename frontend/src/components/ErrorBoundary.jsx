// src/components/ErrorBoundary.jsx

import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service here.
    console.error('Uncaught error:', error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // If a fallback UI is provided via props, render it.
      if (fallback) {
        return fallback;
      }

      // Otherwise, render a default fallback UI.
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <svg
            className="w-16 h-16 text-red-500 mb-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Something went wrong.
          </h2>
          {error && <p className="text-gray-700">{error.toString()}</p>}
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  fallback: null,
};

export default ErrorBoundary;
