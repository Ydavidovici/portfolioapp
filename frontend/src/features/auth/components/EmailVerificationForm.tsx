// src/features/auth/components/EmailVerificationForm.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../authSlice';
import { RootState } from '../../store/store';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import { useLocation, useHistory } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const EmailVerificationForm: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const token = query.get('token') || '';

  const auth = useSelector((state: RootState) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token))
        .unwrap()
        .then((res) => {
          setVerificationStatus(res.message); // Assuming backend returns a message
          // Optionally, redirect to login after a delay
          setTimeout(() => {
            history.push('/login');
          }, 3000);
        })
        .catch((err) => {
          setVerificationStatus(err);
        });
    }
  }, [dispatch, token, history]);

  if (!token) {
    return (
      <div className="text-center text-red-500">
        Invalid verification link.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {auth.loading ? (
        <LoadingSpinner size="lg" color="text-blue-500" />
      ) : (
        <div>
          {verificationStatus.includes('success') ? (
            <div className="text-green-500">{verificationStatus}</div>
          ) : (
            <div className="text-red-500">{verificationStatus}</div>
          )}
          <div className="mt-4 text-center">
            {verificationStatus.includes('success') ? (
              <p>You will be redirected to the login page shortly.</p>
            ) : (
              <p>
                Please contact support or{' '}
                <a href="/register" className="text-blue-500 hover:underline">
                  register again
                </a>
                .
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationForm;
