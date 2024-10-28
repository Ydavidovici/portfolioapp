// src/features/developerDashboard/components/Message/MessageDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';
import PropTypes from 'prop-types';
// import './MessageDetails.css'; // Optional: For styling

const MessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch message details
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/messages/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch message details');
        }
        const data = await response.json();
        setMessage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete message');
        }
        // Redirect to messages list after deletion
        navigate('/developer-dashboard/messages');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading message details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!message) return <p>Message not found.</p>;

  const { senderName, content, createdAt } = message;
  const userRole = user?.role;

  return (
    <div className="message-details">
      <h2>Message Details</h2>
      <p>
        <strong>Sender:</strong> {senderName}
      </p>
      <p>
        <strong>Content:</strong> {content}
      </p>
      <p>
        <strong>Received At:</strong> {new Date(createdAt).toLocaleString()}
      </p>
      {/* Display other message details as necessary */}

      <div className="message-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/messages/edit/${message.id}`}>
              <button>Edit Message</button>
            </Link>
            <button onClick={handleDelete}>Delete Message</button>
          </>
        )}
        <Link to="/developer-dashboard/messages">
          <button>Back to Messages</button>
        </Link>
      </div>
    </div>
  );
};

MessageDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default MessageDetails;
