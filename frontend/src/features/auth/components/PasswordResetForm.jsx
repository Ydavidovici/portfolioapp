// src/features/auth/components/PasswordResetForm.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../Components/LoadingSpinner';

const PasswordResetForm = () => {
    const { requestPasswordReset, loading, error, success } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await requestPasswordReset({ email });
            setSuccessMessage('Password reset link sent to your email.');
        } catch (err) {
            // Error is handled by AuthContext
        }
    };

    return (
        <>
            {error && (
                <div className="text-red-500" role="alert">
                    {error}
                </div>
            )}
            {success && (
                <div className="text-green-500" role="status">
                    {success}
                </div>
            )}
            {successMessage && (
                <div className="text-green-500" role="status">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-medium">
                        Registered Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your registered email"
                    />
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Reset Password'}
                </button>
            </form>
        </>
    );
};

export default PasswordResetForm;
