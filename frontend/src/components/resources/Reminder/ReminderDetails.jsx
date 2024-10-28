// src/components/resources/Reminder/ReminderDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ReminderDetails.css'; // Optional: For styling

const ReminderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reminder details
  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const response = await fetch(`/api/reminders/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reminder details');
        }
        const data = await response.json();
        setReminder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReminder();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        const response = await fetch(`/api/reminders/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete reminder');
        }
        // Redirect to reminders list after deletion
        navigate('/developer-dashboard/reminders');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading reminder details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!reminder) return <p>Reminder not found.</p>;

  const { title, description } = reminder;
  const userRole = user?.role;

  return (
    <div className="reminder-details">
      <h2>Reminder: {title}</h2>
      <p>
        <strong>Description:</strong> {description}
      </p>
      {/* Display other reminder details as necessary */}

      <div className="reminder-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/reminders/edit/${reminder.id}`}>
              <button>Edit Reminder</button>
            </Link>
            <button onClick={handleDelete}>Delete Reminder</button>
          </>
        )}
        <Link to="/developer-dashboard/reminders">
          <button>Back to Reminders</button>
        </Link>
      </div>
    </div>
  );
};

ReminderDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default ReminderDetails;
