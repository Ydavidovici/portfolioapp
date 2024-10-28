// src/components/resources/Note/NoteDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './NoteDetails.css'; // Optional: For styling

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch note details
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch note details');
        }
        const data = await response.json();
        setNote(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete note');
        }
        // Redirect to notes list after deletion
        navigate('/developer-dashboard/notes');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading note details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!note) return <p>Note not found.</p>;

  const { title, content, author, createdAt } = note;
  const userRole = user?.role;

  return (
    <div className="note-details">
      <h2>{title}</h2>
      <p>
        <strong>Content:</strong> {content}
      </p>
      <p>
        <strong>Author:</strong> {author}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
      </p>
      {/* Display other note details as necessary */}

      <div className="note-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/notes/edit/${note.id}`}>
              <button>Edit Note</button>
            </Link>
            <button onClick={handleDelete}>Delete Note</button>
          </>
        )}
        <Link to="/developer-dashboard/notes">
          <button>Back to Notes</button>
        </Link>
      </div>
    </div>
  );
};

NoteDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default NoteDetails;
