// src/features/calendarEntries/commonComponents/CalendarEntriesForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCalendarEntry } from '../calendarEntriesSlice';

const CalendarEntriesForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createCalendarEntry({ title, date }));
    setTitle('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry Title"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Add Entry</button>
    </form>
  );
};

export default CalendarEntriesForm;
