// src/components/resources/Note/NoteList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotes, removeNote } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Note } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';
import './NoteList.css'; // Optional: For styling

const NoteList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { notes, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    useEffect(() => {
        dispatch(getNotes());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            dispatch(removeNote(id));
        }
    };

    if (loading) return <p>Loading notes...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (notes.length === 0) return <p>No notes found.</p>;

    return (
        <div className="note-list">
            <h2>Notes</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/notes/create">
                    <button className="create-button">Add New Note</button>
                </Link>
            )}
            <ul>
                {notes.map((note: Note) => (
                    <li key={note.id} className="note-item">
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <p>Author: {note.author}</p>
                        <p>Created At: {new Date(note.createdAt).toLocaleDateString()}</p>
                        <div className="note-actions">
                            <Link to={`/developer-dashboard/notes/${note.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/notes/edit/${note.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoteList;
