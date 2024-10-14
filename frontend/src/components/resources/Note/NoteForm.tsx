// src/components/resources/Note/NoteForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, editNote, getNotes } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Note } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';
import './NoteForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const NoteForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { notes, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingNote = notes.find((note) => note.id === id);

    const [title, setTitle] = useState(existingNote ? existingNote.title : '');
    const [content, setContent] = useState(existingNote ? existingNote.content : '');
    const [author, setAuthor] = useState(existingNote ? existingNote.author : '');

    useEffect(() => {
        if (!existingNote && id) {
            dispatch(getNotes());
        }
    }, [dispatch, existingNote, id]);

    useEffect(() => {
        if (existingNote) {
            setTitle(existingNote.title);
            setContent(existingNote.content);
            setAuthor(existingNote.author);
        }
    }, [existingNote]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingNote) {
            await dispatch(
                editNote({
                    ...existingNote,
                    title,
                    content,
                    author,
                })
            );
        } else {
            await dispatch(
                addNote({
                    title,
                    content,
                    author,
                    createdAt: new Date().toISOString(), // Assuming backend handles this, adjust as necessary
                })
            );
        }
        history.push('/developer-dashboard/notes');
    };

    return (
        <div className="note-form">
            <h2>{id ? 'Edit Note' : 'Create Note'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Content:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Author:</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                {/* Add more form fields as necessary */}
                <div className="form-actions">
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/notes')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default NoteForm;
