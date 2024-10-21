// src/features/auth/pages/EmailVerificationPage.tsx

import React from 'react';
import EmailVerificationForm from '../components/EmailVerificationForm';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

const EmailVerificationPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-6">Email Verification</h2>
          <EmailVerificationForm />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EmailVerificationPage;
