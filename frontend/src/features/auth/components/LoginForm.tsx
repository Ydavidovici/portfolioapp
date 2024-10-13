// src/features/auth/commonComponents/LoginForm.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../authSlice';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
