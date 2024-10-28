// src/components/resources/ChecklistItem/ChecklistItemForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ChecklistItemForm.css'; // Optional: For styling

const ChecklistItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [checklistItem, setChecklistItem] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing checklist item details if editing
  useEffect(() => {
    if (id) {
      const fetchChecklistItem = async () => {
        try {
          const response = await fetch(`/api/checklist-items/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch checklist item details');
          }
          const data = await response.json();
          setChecklistItem(data);
          setTitle(data.title);
          setDescription(data.description || '');
          setStatus(data.status);
          setDueDate(data.dueDate || '');
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchChecklistItem();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (id) {
        // Editing existing checklist item
        response = await fetch(`/api/checklist-items/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, status, dueDate }),
        });
      } else {
        // Creating new checklist item
        response = await fetch('/api/checklist-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, status, dueDate }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save checklist item');
      }

      // Redirect to checklist items list after successful operation
      navigate('/developer-dashboard/checklist-items');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !checklistItem) return <p>Checklist item not found.</p>;

  return (
    <div className="checklistitem-form">
      <h2>{id ? 'Edit Checklist Item' : 'Create Checklist Item'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="item-title">Title:</label>
          <input
            id="item-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-description">Description (optional):</label>
          <textarea
            id="item-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-status">Status:</label>
          <select
            id="item-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="item-dueDate">Due Date (optional):</label>
          <input
            id="item-dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/checklist-items')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

ChecklistItemForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default ChecklistItemForm;
