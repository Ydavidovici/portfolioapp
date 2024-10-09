// src/features/auth/pages/RegisterPage.tsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
