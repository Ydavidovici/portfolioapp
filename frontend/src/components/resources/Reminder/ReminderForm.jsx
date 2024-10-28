// src/components/resources/Reminder/ReminderForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ReminderForm.css'; // Optional: For styling

const ReminderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [reminder, setReminder] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing reminder details if editing
  useEffect(() => {
    if (id) {
      const fetchReminder = async () => {
        try {
          const response = await fetch(`/api/reminders/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch reminder details');
          }
          const data = await response.json();
          setReminder(data);
          setTitle(data.title);
          setDescription(data.description);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchReminder();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        title,
        description,
      };

      if (id) {
        // Editing existing reminder
        response = await fetch(`/api/reminders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new reminder
        response = await fetch('/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save reminder');
      }

      // Redirect to reminders list after successful operation
      navigate('/developer-dashboard/reminders');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !reminder) return <p>Reminder not found.</p>;

  return (
    <div className="reminder-form">
      <h2>{id ? 'Edit Reminder' : 'Create Reminder'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reminder-title">Title:</label>
          <input
            id="reminder-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reminder-description">Description:</label>
          <textarea
            id="reminder-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/reminders')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

ReminderForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default ReminderForm;
