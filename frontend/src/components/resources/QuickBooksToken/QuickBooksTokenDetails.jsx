// src/components/resources/QuickBooksToken/QuickBooksTokenDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './QuickBooksTokenDetails.css'; // Optional: For styling

const QuickBooksTokenDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch QuickBooks token details
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`/api/quickbooks-tokens/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch QuickBooks token details');
        }
        const data = await response.json();
        setToken(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm('Are you sure you want to delete this QuickBooks token?')
    ) {
      try {
        const response = await fetch(`/api/quickbooks-tokens/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete QuickBooks token');
        }
        // Redirect to QuickBooks tokens list after deletion
        navigate('/developer-dashboard/quickbooks-tokens');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading QuickBooks token details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!token) return <p>QuickBooks token not found.</p>;

  const { access_token, refresh_token, token_type, scope, expires_at } = token;
  const userRole = user?.role;

  return (
    <div className="quickbooks-token-details">
      <h2>QuickBooks Token ID: {token.id}</h2>
      <p>
        <strong>Access Token:</strong> {access_token}
      </p>
      <p>
        <strong>Refresh Token:</strong> {refresh_token}
      </p>
      <p>
        <strong>Token Type:</strong> {token_type}
      </p>
      <p>
        <strong>Scope:</strong> {scope}
      </p>
      <p>
        <strong>Expires At:</strong> {new Date(expires_at).toLocaleString()}
      </p>
      {/* Display other token details as necessary */}

      <div className="quickbooks-token-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link
              to={`/developer-dashboard/quickbooks-tokens/edit/${token.id}`}
            >
              <button>Edit Token</button>
            </Link>
            <button onClick={handleDelete}>Delete Token</button>
          </>
        )}
        <Link to="/developer-dashboard/quickbooks-tokens">
          <button>Back to QuickBooks Tokens</button>
        </Link>
      </div>
    </div>
  );
};

QuickBooksTokenDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default QuickBooksTokenDetails;
