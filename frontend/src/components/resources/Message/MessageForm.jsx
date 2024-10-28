// src/features/developerDashboard/components/Message/MessageForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './MessageForm.css'; // Optional: For styling

const MessageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [senderName, setSenderName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing message details if editing
  useEffect(() => {
    if (id) {
      const fetchMessage = async () => {
        try {
          const response = await fetch(`/api/messages/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch message details');
          }
          const data = await response.json();
          setMessage(data);
          setSenderName(data.senderName);
          setContent(data.content);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMessage();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        senderName,
        content,
      };

      if (id) {
        // Editing existing message
        response = await fetch(`/api/messages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new message
        response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            createdAt: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save message');
      }

      // Redirect to messages list after successful operation
      navigate('/developer-dashboard/messages');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !message) return <p>Message not found.</p>;

  return (
    <div className="message-form">
      <h2>{id ? 'Edit Message' : 'Create Message'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message-sender">Sender Name:</label>
          <input
            id="message-sender"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message-content">Content:</label>
          <textarea
            id="message-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/messages')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

MessageForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default MessageForm;
