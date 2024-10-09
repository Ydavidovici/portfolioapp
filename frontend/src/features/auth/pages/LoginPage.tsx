// src/features/auth/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
