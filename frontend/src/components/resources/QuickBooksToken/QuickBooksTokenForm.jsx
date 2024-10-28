// src/components/resources/QuickBooksToken/QuickBooksTokenForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './QuickBooksTokenForm.css'; // Optional: For styling

const QuickBooksTokenForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [token, setToken] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [tokenType, setTokenType] = useState('');
  const [scope, setScope] = useState('');
  const [expiresIn, setExpiresIn] = useState(''); // Number of seconds until expiration
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing QuickBooks token details if editing
  useEffect(() => {
    if (id) {
      const fetchToken = async () => {
        try {
          const response = await fetch(`/api/quickbooks-tokens/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch QuickBooks token details');
          }
          const data = await response.json();
          setToken(data);
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setTokenType(data.token_type);
          setScope(data.scope);
          setExpiresAt(data.expires_at);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchToken();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      let calculatedExpiresAt = expiresAt;

      if (!calculatedExpiresAt && expiresIn) {
        const now = new Date();
        now.setSeconds(now.getSeconds() + parseInt(expiresIn, 10));
        calculatedExpiresAt = now.toISOString();
      }

      const payload = {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        scope,
        expires_at: calculatedExpiresAt,
      };

      if (id) {
        // Editing existing QuickBooks token
        response = await fetch(`/api/quickbooks-tokens/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new QuickBooks token
        response = await fetch('/api/quickbooks-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save QuickBooks token');
      }

      // Redirect to QuickBooks tokens list after successful operation
      navigate('/developer-dashboard/quickbooks-tokens');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !token) return <p>QuickBooks token not found.</p>;

  return (
    <div className="quickbooks-token-form">
      <h2>{id ? 'Edit QuickBooks Token' : 'Create QuickBooks Token'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="token-access">Access Token:</label>
          <input
            id="token-access"
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="token-refresh">Refresh Token:</label>
          <input
            id="token-refresh"
            type="text"
            value={refreshToken}
            onChange={(e) => setRefreshToken(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="token-type">Token Type:</label>
          <input
            id="token-type"
            type="text"
            value={tokenType}
            onChange={(e) => setTokenType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="token-scope">Scope:</label>
          <input
            id="token-scope"
            type="text"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            required
          />
        </div>
        {!id && (
          <div className="form-group">
            <label htmlFor="token-expires-in">Expires In (seconds):</label>
            <input
              id="token-expires-in"
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="token-expires-at">Expires At:</label>
          <input
            id="token-expires-at"
            type="datetime-local"
            value={
              expiresAt ? new Date(expiresAt).toISOString().slice(0, 16) : ''
            }
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/quickbooks-tokens')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

QuickBooksTokenForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default QuickBooksTokenForm;
