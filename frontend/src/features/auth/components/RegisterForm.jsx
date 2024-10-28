// src/features/auth/components/RegisterForm.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../Components/LoadingSpinner';

const RegisterForm = () => {
    const { registerUser, loading, error } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        await registerUser({ name, email, password });
        // Handle success or redirect as needed
    };

    return (
        <>
            {error && (
                <div className="text-red-500 text-center mb-4" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1 font-medium">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
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
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="mb-1 font-medium">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                    />
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                    disabled={loading}
                >
                    {loading ? (
                        <LoadingSpinner size="sm" color="text-white" />
                    ) : (
                        'Register'
                    )}
                </button>
            </form>
        </>
    );
};

export default RegisterForm;
