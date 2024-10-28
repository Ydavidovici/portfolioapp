// src/components/resources/Feedback/FeedbackForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './FeedbackForm.css'; // Optional: For styling

const FeedbackForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [feedback, setFeedback] = useState(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing feedback details if editing
  useEffect(() => {
    if (id) {
      const fetchFeedback = async () => {
        try {
          const response = await fetch(`/api/feedbacks/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch feedback details');
          }
          const data = await response.json();
          setFeedback(data);
          setTitle(data.title);
          setComment(data.comment);
          setRating(data.rating);
          setAuthor(data.author);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFeedback();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        title,
        comment,
        rating,
        author,
      };

      if (id) {
        // Editing existing feedback
        response = await fetch(`/api/feedbacks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new feedback
        response = await fetch('/api/feedbacks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            createdAt: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save feedback');
      }

      // Redirect to feedbacks list after successful operation
      navigate('/developer-dashboard/feedbacks');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !feedback) return <p>Feedback not found.</p>;

  return (
    <div className="feedback-form">
      <h2>{id ? 'Edit Feedback' : 'Create Feedback'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fb-title">Title:</label>
          <input
            id="fb-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fb-comment">Comment:</label>
          <textarea
            id="fb-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fb-rating">Rating:</label>
          <select
            id="fb-rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fb-author">Author:</label>
          <input
            id="fb-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/feedbacks')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

FeedbackForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default FeedbackForm;
