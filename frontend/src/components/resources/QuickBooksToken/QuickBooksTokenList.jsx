// src/components/resources/QuickBooksToken/QuickBooksTokenList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './QuickBooksTokenList.css'; // Optional: For styling

const QuickBooksTokenList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const {
    data: quickBooksTokens,
    loading,
    error,
  } = useFetch('/api/quickbooks-tokens');
  const [tokenList, setTokenList] = useState([]);

  // Update tokenList when quickBooksTokens data changes
  useEffect(() => {
    if (quickBooksTokens) {
      setTokenList(quickBooksTokens);
    }
  }, [quickBooksTokens]);

  const handleDelete = async (id) => {
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
        // Remove the deleted token from local state to update UI
        setTokenList((prevTokens) =>
          prevTokens.filter((token) => token.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading QuickBooks tokens...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!tokenList || tokenList.length === 0)
    return <p>No QuickBooks tokens found.</p>;

  return (
    <div className="quickbooks-token-list">
      <h2>QuickBooks Tokens</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/quickbooks-tokens/create">
          <button className="create-button">Add New Token</button>
        </Link>
      )}
      <ul>
        {tokenList.map((token) => (
          <li key={token.id} className="quickbooks-token-item">
            <h3>Token ID: {token.id}</h3>
            <p>
              <strong>Token Type:</strong> {token.token_type}
            </p>
            <p>
              <strong>Scope:</strong> {token.scope}
            </p>
            <p>
              <strong>Expires At:</strong>{' '}
              {new Date(token.expires_at).toLocaleString()}
            </p>
            {/* Display other token details as necessary */}
            <div className="quickbooks-token-actions">
              <Link to={`/developer-dashboard/quickbooks-tokens/${token.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link
                    to={`/developer-dashboard/quickbooks-tokens/edit/${token.id}`}
                  >
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(token.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

QuickBooksTokenList.propTypes = {
  // Define prop types if props are expected in the future
};

export default QuickBooksTokenList;
