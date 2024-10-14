// src/commonComponents/PrivateRoute.tsx

import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  requiredRole?: string; // Optional: Specify required role
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, requiredRole, ...rest }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!auth.token;
  const userRole = auth.user?.role;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          requiredRole ? (
            userRole === requiredRole ? (
              <Component {...props} />
            ) : (
              <Redirect to="/unauthorized" />
            )
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
