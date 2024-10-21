// src/components/resources/CalendarEntry/CalendarEntryDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCalendarEntries } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { CalendarEntry } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';
import './CalendarEntryDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const CalendarEntryDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { calendarEntries, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const calendarEntry: CalendarEntry | undefined = calendarEntries.find((entry) => entry.id === id);

    useEffect(() => {
        if (!calendarEntry) {
            dispatch(getCalendarEntries());
        }
    }, [dispatch, calendarEntry]);

    if (loading) return <p>Loading calendar entry details...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!calendarEntry) return <p>Calendar entry not found.</p>;

    return (
        <div className="calendarentry-details">
            <h2>{calendarEntry.title}</h2>
            <p><strong>Description:</strong> {calendarEntry.description || 'No description provided.'}</p>
            <p><strong>Date:</strong> {new Date(calendarEntry.date).toLocaleDateString()}</p>
            {/* Display other calendar entry details as necessary */}

            <div className="calendarentry-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/calendar-entries/edit/${calendarEntry.id}`}>
                            <button>Edit Calendar Entry</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/calendar-entries">
                    <button>Back to Calendar Entries</button>
                </Link>
            </div>
        </div>
    );
};

export default CalendarEntryDetails;
