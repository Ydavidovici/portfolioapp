// src/features/auth/components/RegisterForm.jsx

import React, { useState, FormEvent, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../Components/LoadingSpinner';

const RegisterForm = () => {
  const { setUser, loading, error } = useContext(AuthContext); // Assuming setUser can be used after registration
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement registration logic, possibly a register function in AuthContext
    try {
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
      });
      setUser(response.data.user);
      // Redirect or show success message
      history.push('/login');
    } catch (err) {
      // Handle error appropriately
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your name"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your email"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
        disabled={loading}
      >
        {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
