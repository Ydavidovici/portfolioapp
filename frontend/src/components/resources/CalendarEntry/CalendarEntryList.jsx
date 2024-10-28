// src/components/resources/CalendarEntry/CalendarEntryList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './CalendarEntryList.css'; // Optional: For styling

const CalendarEntryList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const {
    data: calendarEntries,
    loading,
    error,
  } = useFetch('/api/calendar-entries');
  const [entryList, setEntryList] = useState([]);

  // Update entryList when calendarEntries data changes
  useEffect(() => {
    if (calendarEntries) {
      setEntryList(calendarEntries);
    }
  }, [calendarEntries]);

  const handleDelete = async (id) => {
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
        // Remove the deleted entry from local state to update UI
        setEntryList((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading calendar entries...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!entryList || entryList.length === 0)
    return <p>No calendar entries found.</p>;

  return (
    <div className="calendarentry-list">
      <h2>Calendar Entries</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/calendar-entries/create">
          <button className="create-button">Add New Calendar Entry</button>
        </Link>
      )}
      <ul>
        {entryList.map((entry) => (
          <li key={entry.id} className="calendarentry-item">
            <h3>{entry.title}</h3>
            <p>{entry.description}</p>
            <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
            {entry.location && <p>Location: {entry.location}</p>}
            {/* Display other calendar entry details as necessary */}
            <div className="calendarentry-actions">
              <Link to={`/developer-dashboard/calendar-entries/${entry.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link
                    to={`/developer-dashboard/calendar-entries/edit/${entry.id}`}
                  >
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

CalendarEntryList.propTypes = {
  // No props are passed directly to this component
};

export default CalendarEntryList;
