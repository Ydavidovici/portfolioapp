// src/components/resources/CalendarEntry/CalendarEntryDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './CalendarEntryDetails.css'; // Optional: For styling

const CalendarEntryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [calendarEntry, setCalendarEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch calendar entry details
  useEffect(() => {
    const fetchCalendarEntry = async () => {
      try {
        const response = await fetch(`/api/calendar-entries/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch calendar entry details');
        }
        const data = await response.json();
        setCalendarEntry(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEntry();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm('Are you sure you want to delete this calendar entry?')
    ) {
      try {
        const response = await fetch(`/api/calendar-entries/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete calendar entry');
        }
        // Redirect to calendar entries list after deletion
        navigate('/developer-dashboard/calendar-entries');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading calendar entry details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!calendarEntry) return <p>Calendar entry not found.</p>;

  const { title, description, date, location } = calendarEntry;
  const userRole = user?.role;

  return (
    <div className="calendarentry-details">
      <h2>{title}</h2>
      <p>
        <strong>Description:</strong>{' '}
        {description || 'No description provided.'}
      </p>
      <p>
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>
      {location && (
        <p>
          <strong>Location:</strong> {location}
        </p>
      )}
      {/* Display other calendar entry details as necessary */}

      <div className="calendarentry-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link
              to={`/developer-dashboard/calendar-entries/edit/${calendarEntry.id}`}
            >
              <button>Edit Calendar Entry</button>
            </Link>
            <button onClick={handleDelete}>Delete Calendar Entry</button>
          </>
        )}
        <Link to="/developer-dashboard/calendar-entries">
          <button>Back to Calendar Entries</button>
        </Link>
      </div>
    </div>
  );
};

CalendarEntryDetails.propTypes = {
  // No props are passed directly to this component
};

export default CalendarEntryDetails;
