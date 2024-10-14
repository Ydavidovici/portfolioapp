// src/components/resources/Note/NoteDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotes } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Note } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';
import './NoteDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const NoteDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { notes, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const note: Note | undefined = notes.find((n) => n.id === id);

    useEffect(() => {
        if (!note) {
            dispatch(getNotes());
        }
    }, [dispatch, note]);

    if (loading) return <p>Loading note details...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!note) return <p>Note not found.</p>;

    return (
        <div className="note-details">
            <h2>{note.title}</h2>
            <p><strong>Content:</strong> {note.content}</p>
            <p><strong>Author:</strong> {note.author}</p>
            <p><strong>Created At:</strong> {new Date(note.createdAt).toLocaleDateString()}</p>
            {/* Display other note details as necessary */}

            <div className="note-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/notes/edit/${note.id}`}>
                            <button>Edit Note</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/notes">
                    <button>Back to Notes</button>
                </Link>
            </div>
        </div>
    );
};

export default NoteDetails;
