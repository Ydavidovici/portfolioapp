// src/features/auth/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import apiClient from '@/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/register', { name, email, password });
      dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('authToken', response.data.token); // Persist token
      toast.success('Registered successfully!');
      navigate('/'); // Redirect to Home or Dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {/* Form Fields */}
    </form>
  );
};

export default RegisterForm;
