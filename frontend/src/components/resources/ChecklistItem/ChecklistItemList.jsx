// src/components/resources/ChecklistItem/ChecklistItemList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './ChecklistItemList.css'; // Optional: For styling

const ChecklistItemList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const {
    data: checklistItems,
    loading,
    error,
  } = useFetch('/api/checklist-items');
  const [itemList, setItemList] = useState([]);

  // Update itemList when checklistItems data changes
  useEffect(() => {
    if (checklistItems) {
      setItemList(checklistItems);
    }
  }, [checklistItems]);

  const handleDelete = async (id) => {
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
        // Remove the deleted item from local state to update UI
        setItemList((prevItems) => prevItems.filter((item) => item.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading checklist items...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!itemList || itemList.length === 0)
    return <p>No checklist items found.</p>;

  return (
    <div className="checklistitem-list">
      <h2>Checklist Items</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/checklist-items/create">
          <button className="create-button">Add New Checklist Item</button>
        </Link>
      )}
      <ul>
        {itemList.map((item) => (
          <li key={item.id} className="checklistitem-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Status: {item.status}</p>
            {item.dueDate && (
              <p>Due Date: {new Date(item.dueDate).toLocaleDateString()}</p>
            )}
            {/* Display other checklist item details as necessary */}
            <div className="checklistitem-actions">
              <Link to={`/developer-dashboard/checklist-items/${item.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link
                    to={`/developer-dashboard/checklist-items/edit/${item.id}`}
                  >
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChecklistItemList.propTypes = {
  // Define prop types if props are expected in the future
};

export default ChecklistItemList;
