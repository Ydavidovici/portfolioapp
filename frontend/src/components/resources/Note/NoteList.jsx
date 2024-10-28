// src/components/resources/Note/NoteList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './NoteList.css'; // Optional: For styling

const NoteList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: notes, loading, error } = useFetch('/api/notes');
  const [noteList, setNoteList] = useState([]);

  // Update noteList when notes data changes
  useEffect(() => {
    if (notes) {
      setNoteList(notes);
    }
  }, [notes]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete note');
        }
        // Remove the deleted note from local state to update UI
        setNoteList((prevNotes) => prevNotes.filter((note) => note.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading notes...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!noteList || noteList.length === 0) return <p>No notes found.</p>;

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/notes/create">
          <button className="create-button">Add New Note</button>
        </Link>
      )}
      <ul>
        {noteList.map((note) => (
          <li key={note.id} className="note-item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p>
              <strong>Author:</strong> {note.author}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
            {/* Display other note details as necessary */}
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

NoteList.propTypes = {
  // Define prop types if props are expected in the future
};

export default NoteList;
