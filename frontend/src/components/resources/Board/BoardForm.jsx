// src/components/resources/Board/BoardForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './BoardForm.css'; // Optional: For styling

const BoardForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [board, setBoard] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing board details if editing
  useEffect(() => {
    if (id) {
      const fetchBoard = async () => {
        try {
          const response = await fetch(`/api/boards/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch board details');
          }
          const data = await response.json();
          setBoard(data);
          setName(data.name);
          setDescription(data.description || '');
          setStatus(data.status);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBoard();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (id) {
        // Editing existing board
        response = await fetch(`/api/boards/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, status }),
        });
      } else {
        // Creating new board
        response = await fetch('/api/boards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, status }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save board');
      }

      // Redirect to boards list after successful operation
      navigate('/developer-dashboard/boards');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !board) return <p>Board not found.</p>;

  return (
    <div className="board-form">
      <h2>{id ? 'Edit Board' : 'Create Board'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="board-name">Name:</label>
          <input
            id="board-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="board-description">Description (optional):</label>
          <textarea
            id="board-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="board-status">Status:</label>
          <select
            id="board-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/boards')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

BoardForm.propTypes = {
  // Define prop types if you pass props. Currently, no props are passed.
};

export default BoardForm;
