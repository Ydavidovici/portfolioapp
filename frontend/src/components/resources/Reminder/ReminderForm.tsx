// src/components/resources/Reminder/ReminderForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReminder, editReminder, getReminders } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Reminder } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';

interface RouteParams {
  id?: string;
}

const ReminderForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const { reminders, error } = useSelector((state: RootState) => state.developerDashboard);
  const existingReminder = reminders.find((reminder) => reminder.id === id);

  const [title, setTitle] = useState(existingReminder ? existingReminder.title : '');
  const [description, setDescription] = useState(existingReminder ? existingReminder.description : '');

  useEffect(() => {
    if (!existingReminder && id) {
      dispatch(getReminders());
    }
  }, [dispatch, existingReminder, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && existingReminder) {
      await dispatch(editReminder({ ...existingReminder, title, description }));
    } else {
      await dispatch(addReminder({ title, description }));
    }
    history.push('/developer-dashboard/reminders');
  };

  return (
    <div>
      <h2>{id ? 'Edit Reminder' : 'Create Reminder'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button type="button" onClick={() => history.push('/developer-dashboard/reminders')}>
            Cancel
          </button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default ReminderForm;
