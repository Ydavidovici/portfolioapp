// src/Components/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ component: Component, requiredRole, ...rest }) => {
  const { user, loading, error } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          // Optionally, render a loading indicator
          return <p>Loading...</p>;
        }

        if (error) {
          // Optionally, handle errors (you might want to redirect or display an error)
          return <p className="error">Error: {error}</p>;
        }

        if (!user) {
          // User is not authenticated
          return <Redirect to="/login" />;
        }

        if (requiredRole && user.role !== requiredRole) {
          // User does not have the required role
          return <Redirect to="/login" />;
        }

        // User is authenticated and has the required role (if any)
        return <Component {...props} />;
      }}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  requiredRole: PropTypes.string,
};

PrivateRoute.defaultProps = {
  requiredRole: null,
};

export default PrivateRoute;
