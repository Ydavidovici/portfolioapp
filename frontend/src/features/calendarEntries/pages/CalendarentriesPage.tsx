// src/features/calendarEntries/pages/CalendarEntriesPage.tsx
import React from 'react';
import CalendarEntriesList from '../components/CalendarEntriesList';
import CalendarEntriesForm from '../components/CalendarEntriesForm';

const CalendarEntriesPage: React.FC = () => {
  return (
    <div>
      <h1>Calendar Entries</h1>
      <CalendarEntriesForm />
      <CalendarEntriesList />
    </div>
  );
};

export default CalendarEntriesPage;
