// src/components/resources/CalendarEntry/CalendarEntryForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './CalendarEntryForm.css'; // Optional: For styling

const CalendarEntryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [calendarEntry, setCalendarEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing calendar entry details if editing
  useEffect(() => {
    if (id) {
      const fetchCalendarEntry = async () => {
        try {
          const response = await fetch(`/api/calendar-entries/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch calendar entry details');
          }
          const data = await response.json();
          setCalendarEntry(data);
          setTitle(data.title);
          setDescription(data.description || '');
          setDate(data.date);
          setLocation(data.location || '');
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCalendarEntry();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (id) {
        // Editing existing calendar entry
        response = await fetch(`/api/calendar-entries/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, date, location }),
        });
      } else {
        // Creating new calendar entry
        response = await fetch('/api/calendar-entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, date, location }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save calendar entry');
      }

      // Redirect to calendar entries list after successful operation
      navigate('/developer-dashboard/calendar-entries');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !calendarEntry) return <p>Calendar entry not found.</p>;

  return (
    <div className="calendarentry-form">
      <h2>{id ? 'Edit Calendar Entry' : 'Create Calendar Entry'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="entry-title">Title:</label>
          <input
            id="entry-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="entry-description">Description (optional):</label>
          <textarea
            id="entry-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="entry-date">Date:</label>
          <input
            id="entry-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="entry-location">Location (optional):</label>
          <input
            id="entry-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/calendar-entries')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

CalendarEntryForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default CalendarEntryForm;
