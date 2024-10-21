// src/features/auth/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { RootState } from '../../../store/store';
import { Redirect, useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state: RootState) => state.auth);
  const { user, loading, error } = auth;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));

    // After successful login, redirect based on role
    if (auth.user) {
      switch (auth.user.role) {
        case 'admin':
          history.push('/admin-dashboard');
          break;
        case 'developer':
          history.push('/developer-dashboard');
          break;
        case 'client':
          history.push('/client-dashboard');
          break;
        default:
          history.push('/');
      }
    }
  };

  if (user) {
    // If already logged in, redirect to respective dashboard
    switch (user.role) {
      case 'admin':
        return <Redirect to="/admin-dashboard" />;
      case 'developer':
        return <Redirect to="/developer-dashboard" />;
      case 'client':
        return <Redirect to="/client-dashboard" />;
      default:
        return <Redirect to="/" />;
    }
  }

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
