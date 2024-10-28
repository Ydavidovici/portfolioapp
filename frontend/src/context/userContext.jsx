// src/contexts/UserContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create the UserContext
export const UserContext = createContext();

// UserProvider component to wrap around parts of the app that need access to user data
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user as null
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch user data from API or authentication service
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
