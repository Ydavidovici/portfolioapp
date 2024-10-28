// src/components/resources/ChecklistItem/ChecklistItemDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ChecklistItemDetails.css'; // Optional: For styling

const ChecklistItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [checklistItem, setChecklistItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch checklist item details
  useEffect(() => {
    const fetchChecklistItem = async () => {
      try {
        const response = await fetch(`/api/checklist-items/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch checklist item details');
        }
        const data = await response.json();
        setChecklistItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklistItem();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm('Are you sure you want to delete this checklist item?')
    ) {
      try {
        const response = await fetch(`/api/checklist-items/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete checklist item');
        }
        // Redirect to checklist items list after deletion
        navigate('/developer-dashboard/checklist-items');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading checklist item details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!checklistItem) return <p>Checklist item not found.</p>;

  const { title, description, status, dueDate } = checklistItem;
  const userRole = user?.role;

  return (
    <div className="checklistitem-details">
      <h2>{title}</h2>
      <p>
        <strong>Description:</strong>{' '}
        {description || 'No description provided.'}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      {dueDate && (
        <p>
          <strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}
        </p>
      )}
      {/* Display other checklist item details as necessary */}

      <div className="checklistitem-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link
              to={`/developer-dashboard/checklist-items/edit/${checklistItem.id}`}
            >
              <button>Edit Checklist Item</button>
            </Link>
            <button onClick={handleDelete}>Delete Checklist Item</button>
          </>
        )}
        <Link to="/developer-dashboard/checklist-items">
          <button>Back to Checklist Items</button>
        </Link>
      </div>
    </div>
  );
};

ChecklistItemDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default ChecklistItemDetails;
