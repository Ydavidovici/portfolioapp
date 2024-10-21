// src/components/resources/Reminder/ReminderDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReminders } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Reminder } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';

interface RouteParams {
  id: string;
}

const ReminderDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const { reminders, loading, error } = useSelector((state: RootState) => state.developerDashboard);

  const reminder: Reminder | undefined = reminders.find((reminder) => reminder.id === id);

  useEffect(() => {
    if (!reminder) {
      dispatch(getReminders());
    }
  }, [dispatch, reminder]);

  if (loading) return <p>Loading reminder details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!reminder) return <p>Reminder not found.</p>;

  return (
    <div>
      <h2>Reminder: {reminder.title}</h2>
      <p><strong>Description:</strong> {reminder.description}</p>
      <Link to="/developer-dashboard/reminders">
        <button>Back to Reminders</button>
      </Link>
    </div>
  );
};

export default ReminderDetails;
