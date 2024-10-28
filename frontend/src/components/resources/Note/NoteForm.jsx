// src/components/resources/Note/NoteForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './NoteForm.css'; // Optional: For styling

const NoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing note details if editing
  useEffect(() => {
    if (id) {
      const fetchNote = async () => {
        try {
          const response = await fetch(`/api/notes/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch note details');
          }
          const data = await response.json();
          setNote(data);
          setTitle(data.title);
          setContent(data.content);
          setAuthor(data.author);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNote();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        title,
        content,
        author,
      };

      if (id) {
        // Editing existing note
        response = await fetch(`/api/notes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new note
        response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            createdAt: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      // Redirect to notes list after successful operation
      navigate('/developer-dashboard/notes');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !note) return <p>Note not found.</p>;

  return (
    <div className="note-form">
      <h2>{id ? 'Edit Note' : 'Create Note'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="note-title">Title:</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="note-content">Content:</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="note-author">Author:</label>
          <input
            id="note-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/notes')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

NoteForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default NoteForm;
