// src/features/auth/components/EmailVerificationForm.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../Components/LoadingSpinner';

const EmailVerificationForm = () => {
    const { verifyEmail, loading, error } = useContext(AuthContext);
    const [verificationCode, setVerificationCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyEmail({ code: verificationCode });
        // Handle success or redirect as needed
    };

    return (
        <>
            {error && (
                <div className="text-red-500" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="verificationCode" className="mb-1 font-medium">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        id="verificationCode"
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        placeholder="Enter your verification code"
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
                        'Verify Email'
                    )}
                </button>
            </form>
        </>
    );
};

export default EmailVerificationForm;
