// src/components/resources/CalendarEntry/CalendarEntryForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCalendarEntry, editCalendarEntry, getCalendarEntries } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { CalendarEntry } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';
import './CalendarEntryForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const CalendarEntryForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { calendarEntries, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingEntry = calendarEntries.find((entry) => entry.id === id);

    const [title, setTitle] = useState(existingEntry ? existingEntry.title : '');
    const [description, setDescription] = useState(existingEntry ? existingEntry.description || '' : '');
    const [date, setDate] = useState(existingEntry ? existingEntry.date : '');

    useEffect(() => {
        if (!existingEntry && id) {
            dispatch(getCalendarEntries());
        }
    }, [dispatch, existingEntry, id]);

    useEffect(() => {
        if (existingEntry) {
            setTitle(existingEntry.title);
            setDescription(existingEntry.description || '');
            setDate(existingEntry.date);
        }
    }, [existingEntry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingEntry) {
            await dispatch(
                editCalendarEntry({
                    ...existingEntry,
                    title,
                    description,
                    date,
                })
            );
        } else {
            await dispatch(
                addCalendarEntry({
                    title,
                    description,
                    date,
                })
            );
        }
        history.push('/developer-dashboard/calendar-entries');
    };

    return (
        <div className="calendarentry-form">
            <h2>{id ? 'Edit Calendar Entry' : 'Create Calendar Entry'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description (optional):</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                {/* Add more form fields as necessary */}
                <div className="form-actions">
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/calendar-entries')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default CalendarEntryForm;
