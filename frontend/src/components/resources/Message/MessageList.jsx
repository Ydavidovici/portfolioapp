// src/features/developerDashboard/components/Message/MessageList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './MessageList.css'; // Optional: For styling

const MessageList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: messages, loading, error } = useFetch('/api/messages');
  const [messageList, setMessageList] = useState([]);

  // Update messageList when messages data changes
  useEffect(() => {
    if (messages) {
      setMessageList(messages);
    }
  }, [messages]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete message');
        }
        // Remove the deleted message from local state to update UI
        setMessageList((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading messages...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!messageList || messageList.length === 0)
    return <p>No messages found.</p>;

  return (
    <div className="message-list">
      <h2>Recent Messages</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/messages/create">
          <button className="create-button">Add New Message</button>
        </Link>
      )}
      <ul>
        {messageList.map((msg) => (
          <li key={msg.id} className="message-item">
            <strong>{msg.senderName}</strong>: {msg.content}
            <br />
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
            {(userRole === 'admin' || userRole === 'developer') && (
              <div className="message-actions">
                <Link to={`/developer-dashboard/messages/${msg.id}`}>
                  <button>View Details</button>
                </Link>
                <Link to={`/developer-dashboard/messages/edit/${msg.id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(msg.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

MessageList.propTypes = {
  // Define prop types if props are expected in the future
};

export default MessageList;
