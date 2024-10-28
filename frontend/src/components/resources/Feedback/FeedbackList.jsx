// src/components/resources/Feedback/FeedbackList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './FeedbackList.css'; // Optional: For styling

const FeedbackList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: feedbacks, loading, error } = useFetch('/api/feedbacks');
  const [feedbackList, setFeedbackList] = useState([]);

  // Update feedbackList when feedbacks data changes
  useEffect(() => {
    if (feedbacks) {
      setFeedbackList(feedbacks);
    }
  }, [feedbacks]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`/api/feedbacks/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete feedback');
        }
        // Remove the deleted feedback from local state to update UI
        setFeedbackList((prevFeedbacks) =>
          prevFeedbacks.filter((fb) => fb.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading feedbacks...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!feedbackList || feedbackList.length === 0)
    return <p>No feedbacks found.</p>;

  return (
    <div className="feedback-list">
      <h2>Feedbacks</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/feedbacks/create">
          <button className="create-button">Add New Feedback</button>
        </Link>
      )}
      <ul>
        {feedbackList.map((fb) => (
          <li key={fb.id} className="feedback-item">
            <h3>{fb.title}</h3>
            <p>{fb.comment}</p>
            <p>Rating: {fb.rating}/5</p>
            <p>Author: {fb.author}</p>
            <p>Created At: {new Date(fb.createdAt).toLocaleDateString()}</p>
            {/* Display other feedback details as necessary */}
            <div className="feedback-actions">
              <Link to={`/developer-dashboard/feedbacks/${fb.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link to={`/developer-dashboard/feedbacks/edit/${fb.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(fb.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

FeedbackList.propTypes = {
  // Define prop types if props are expected in the future
};

export default FeedbackList;
