// src/components/resources/Checklist/ChecklistList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './ChecklistList.css'; // Optional: For styling

const ChecklistList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: checklists, loading, error } = useFetch('/api/checklists');
  const [checklistList, setChecklistList] = useState([]);

  // Update checklistList when checklists data changes
  useEffect(() => {
    if (checklists) {
      setChecklistList(checklists);
    }
  }, [checklists]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this checklist?')) {
      try {
        const response = await fetch(`/api/checklists/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete checklist');
        }
        // Remove the deleted checklist from local state to update UI
        setChecklistList((prevChecklists) =>
          prevChecklists.filter((cl) => cl.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading checklists...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!checklistList || checklistList.length === 0)
    return <p>No checklists found.</p>;

  return (
    <div className="checklist-list">
      <h2>Checklists</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/checklists/create">
          <button className="create-button">Add New Checklist</button>
        </Link>
      )}
      <ul>
        {checklistList.map((checklist) => (
          <li key={checklist.id} className="checklist-item">
            <h3>{checklist.title}</h3>
            <p>{checklist.description}</p>
            <p>Status: {checklist.status}</p>
            {/* Display other checklist details as necessary */}
            <div className="checklist-actions">
              <Link to={`/developer-dashboard/checklists/${checklist.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link
                    to={`/developer-dashboard/checklists/edit/${checklist.id}`}
                  >
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(checklist.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChecklistList.propTypes = {
  // Define prop types if props are expected in the future
};

export default ChecklistList;
