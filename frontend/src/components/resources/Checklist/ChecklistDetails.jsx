// src/components/resources/Checklist/ChecklistDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ChecklistDetails.css'; // Optional: For styling

const ChecklistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch checklist details
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await fetch(`/api/checklists/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch checklist details');
        }
        const data = await response.json();
        setChecklist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this checklist?')) {
      try {
        const response = await fetch(`/api/checklists/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete checklist');
        }
        // Redirect to checklists list after deletion
        navigate('/developer-dashboard/checklists');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading checklist details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!checklist) return <p>Checklist not found.</p>;

  const { title, description, status, items } = checklist;
  const userRole = user?.role;

  return (
    <div className="checklist-details">
      <h2>{title}</h2>
      <p>
        <strong>Description:</strong>{' '}
        {description || 'No description provided.'}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      {/* Display other checklist details as necessary */}

      {/* Example: Display associated items */}
      <h3>Items</h3>
      {items && items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span> -{' '}
              {item.completed ? 'Completed' : 'Pending'}
              {item.dueDate && (
                <span>
                  {' '}
                  - Due: {new Date(item.dueDate).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in this checklist.</p>
      )}

      <div className="checklist-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/checklists/edit/${checklist.id}`}>
              <button>Edit Checklist</button>
            </Link>
            <button onClick={handleDelete}>Delete Checklist</button>
          </>
        )}
        <Link to="/developer-dashboard/checklists">
          <button>Back to Checklists</button>
        </Link>
      </div>
    </div>
  );
};

ChecklistDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default ChecklistDetails;
