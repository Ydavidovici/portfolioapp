// src/features/calendarEntries/components/CalendarEntriesList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalendarEntries } from '../calendarEntriesSlice';
import { RootState } from '../../store/types';

const CalendarEntriesList: React.FC = () => {
  const dispatch = useDispatch();
  const { calendarEntries, loading, error } = useSelector((state: RootState) => state.calendarEntries);

  useEffect(() => {
    dispatch(fetchCalendarEntries());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {calendarEntries.map((entry) => (
        <li key={entry.id}>
          {entry.title} - {new Date(entry.date).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
};

export default CalendarEntriesList;
