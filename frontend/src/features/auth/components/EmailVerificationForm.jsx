// src/features/auth/components/EmailVerificationForm.jsx

import React, { useState, FormEvent, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../Components/LoadingSpinner';

const EmailVerificationForm = () => {
  const { verifyEmail, loading, error, success } = useContext(AuthContext); // Assuming verifyEmail is provided
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail({ code: verificationCode });
      // Optionally, handle post-verification logic
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && (
        <div className="text-green-500">Email verified successfully!</div>
      )}
      <div className="flex flex-col">
        <label htmlFor="verificationCode" className="mb-1 font-medium">
          Verification Code
        </label>
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
  );
};

export default EmailVerificationForm;
