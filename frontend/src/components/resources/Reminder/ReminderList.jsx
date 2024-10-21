// src/components/resources/Reminder/ReminderList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReminders, removeReminder } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Reminder } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';

const ReminderList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reminders, loading, error } = useSelector((state: RootState) => state.developerDashboard);

  useEffect(() => {
    dispatch(getReminders());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      dispatch(removeReminder(id));
    }
  };

  if (loading) return <p>Loading reminders...</p>;
  if (error) return <p>Error: {error}</p>;
  if (reminders.length === 0) return <p>No reminders found.</p>;

  return (
    <div>
      <h2>Reminders</h2>
      <Link to="/developer-dashboard/reminders/create">
        <button>Add New Reminder</button>
      </Link>
      <ul>
        {reminders.map((reminder: Reminder) => (
          <li key={reminder.id}>
            <h3>{reminder.title}</h3>
            <p>{reminder.description}</p>
            <div>
              <Link to={`/developer-dashboard/reminders/${reminder.id}`}>
                <button>View Details</button>
              </Link>
              <Link to={`/developer-dashboard/reminders/edit/${reminder.id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(reminder.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;
