// src/components/resources/Checklist/ChecklistForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ChecklistForm.css'; // Optional: For styling

const ChecklistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [checklist, setChecklist] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing checklist details if editing
  useEffect(() => {
    if (id) {
      const fetchChecklist = async () => {
        try {
          const response = await fetch(`/api/checklists/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch checklist details');
          }
          const data = await response.json();
          setChecklist(data);
          setTitle(data.title);
          setDescription(data.description || '');
          setStatus(data.status);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchChecklist();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (id) {
        // Editing existing checklist
        response = await fetch(`/api/checklists/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, status }),
        });
      } else {
        // Creating new checklist
        response = await fetch('/api/checklists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, status }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save checklist');
      }

      // Redirect to checklists list after successful operation
      navigate('/developer-dashboard/checklists');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !checklist) return <p>Checklist not found.</p>;

  return (
    <div className="checklist-form">
      <h2>{id ? 'Edit Checklist' : 'Create Checklist'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="checklist-title">Title:</label>
          <input
            id="checklist-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checklist-description">Description (optional):</label>
          <textarea
            id="checklist-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="checklist-status">Status:</label>
          <select
            id="checklist-status"
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
            onClick={() => navigate('/developer-dashboard/checklists')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

ChecklistForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default ChecklistForm;
