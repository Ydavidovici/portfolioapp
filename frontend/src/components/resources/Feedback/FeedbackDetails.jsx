// src/components/resources/Feedback/FeedbackDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './FeedbackDetails.css'; // Optional: For styling

const FeedbackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback details
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`/api/feedbacks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback details');
        }
        const data = await response.json();
        setFeedback(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`/api/feedbacks/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete feedback');
        }
        // Redirect to feedbacks list after deletion
        navigate('/developer-dashboard/feedbacks');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading feedback details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!feedback) return <p>Feedback not found.</p>;

  const { title, comment, rating, author, createdAt } = feedback;
  const userRole = user?.role;

  return (
    <div className="feedback-details">
      <h2>{title}</h2>
      <p>
        <strong>Comment:</strong> {comment}
      </p>
      <p>
        <strong>Rating:</strong> {rating}/5
      </p>
      <p>
        <strong>Author:</strong> {author}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
      </p>
      {/* Display other feedback details as necessary */}

      <div className="feedback-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/feedbacks/edit/${feedback.id}`}>
              <button>Edit Feedback</button>
            </Link>
            <button onClick={handleDelete}>Delete Feedback</button>
          </>
        )}
        <Link to="/developer-dashboard/feedbacks">
          <button>Back to Feedbacks</button>
        </Link>
      </div>
    </div>
  );
};

FeedbackDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default FeedbackDetails;
