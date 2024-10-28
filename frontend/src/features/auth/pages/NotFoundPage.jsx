// src/features/auth/pages/NotFoundPage.jsx

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
      <>
        <Helmet>
          <title>404 - Page Not Found</title>
          <meta
              name="description"
              content="The page you are looking for does not exist."
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="not-found-page flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
          <h1 tabIndex={-1} ref={headingRef} className="text-4xl font-bold mb-4">
            404 - Page Not Found
          </h1>
          <p className="mb-6">Oops! The page you're looking for doesn't exist.</p>
          <Link to="/">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition">
              Go to Home
            </button>
          </Link>
        </div>
      </>
  );
};

export default NotFoundPage;
