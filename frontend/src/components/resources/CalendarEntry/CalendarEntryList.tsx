// src/components/resources/CalendarEntry/CalendarEntryList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCalendarEntries, removeCalendarEntry } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { CalendarEntry } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';
import './CalendarEntryList.css'; // Optional: For styling

const CalendarEntryList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { calendarEntries, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    useEffect(() => {
        dispatch(getCalendarEntries());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this calendar entry?')) {
            dispatch(removeCalendarEntry(id));
        }
    };

    if (loading) return <p>Loading calendar entries...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (calendarEntries.length === 0) return <p>No calendar entries found.</p>;

    return (
        <div className="calendarentry-list">
            <h2>Calendar Entries</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/calendar-entries/create">
                    <button className="create-button">Add New Calendar Entry</button>
                </Link>
            )}
            <ul>
                {calendarEntries.map((entry: CalendarEntry) => (
                    <li key={entry.id} className="calendarentry-item">
                        <h3>{entry.title}</h3>
                        <p>{entry.description}</p>
                        <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
                        <div className="calendarentry-actions">
                            <Link to={`/developer-dashboard/calendar-entries/${entry.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/calendar-entries/edit/${entry.id}`}>
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

export default CalendarEntryList;
