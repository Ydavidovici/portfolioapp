// src/components/resources/Reminder/ReminderList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './ReminderList.css'; // Optional: For styling

const ReminderList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: reminders, loading, error } = useFetch('/api/reminders');
  const [reminderList, setReminderList] = useState([]);

  // Update reminderList when reminders data changes
  useEffect(() => {
    if (reminders) {
      setReminderList(reminders);
    }
  }, [reminders]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        const response = await fetch(`/api/reminders/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete reminder');
        }
        // Remove the deleted reminder from local state to update UI
        setReminderList((prevReminders) =>
          prevReminders.filter((rem) => rem.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading reminders...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!reminderList || reminderList.length === 0)
    return <p>No reminders found.</p>;

  return (
    <div className="reminder-list">
      <h2>Reminders</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/reminders/create">
          <button className="create-button">Add New Reminder</button>
        </Link>
      )}
      <ul>
        {reminderList.map((reminder) => (
          <li key={reminder.id} className="reminder-item">
            <h3>{reminder.title}</h3>
            <p>{reminder.description}</p>
            <div className="reminder-actions">
              <Link to={`/developer-dashboard/reminders/${reminder.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link
                    to={`/developer-dashboard/reminders/edit/${reminder.id}`}
                  >
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(reminder.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ReminderList.propTypes = {
  // Define prop types if props are expected in the future
};

export default ReminderList;
