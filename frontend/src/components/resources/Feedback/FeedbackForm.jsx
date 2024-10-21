// src/components/resources/Feedback/FeedbackForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedback, editFeedback, getFeedbacks } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Feedback } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';
import './FeedbackForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const FeedbackForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { feedbacks, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingFeedback = feedbacks.find((fb) => fb.id === id);

    const [title, setTitle] = useState(existingFeedback ? existingFeedback.title : '');
    const [comment, setComment] = useState(existingFeedback ? existingFeedback.comment : '');
    const [rating, setRating] = useState(existingFeedback ? existingFeedback.rating : 1);
    const [author, setAuthor] = useState(existingFeedback ? existingFeedback.author : '');

    useEffect(() => {
        if (!existingFeedback && id) {
            dispatch(getFeedbacks());
        }
    }, [dispatch, existingFeedback, id]);

    useEffect(() => {
        if (existingFeedback) {
            setTitle(existingFeedback.title);
            setComment(existingFeedback.comment);
            setRating(existingFeedback.rating);
            setAuthor(existingFeedback.author);
        }
    }, [existingFeedback]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingFeedback) {
            await dispatch(
                editFeedback({
                    ...existingFeedback,
                    title,
                    comment,
                    rating,
                    author,
                })
            );
        } else {
            await dispatch(
                addFeedback({
                    title,
                    comment,
                    rating,
                    author,
                    createdAt: new Date().toISOString(), // Assuming backend handles this, adjust as necessary
                })
            );
        }
        history.push('/developer-dashboard/feedbacks');
    };

    return (
        <div className="feedback-form">
            <h2>{id ? 'Edit Feedback' : 'Create Feedback'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Comment:</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Rating:</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                        <option value={1}>1 - Poor</option>
                        <option value={2}>2 - Fair</option>
                        <option value={3}>3 - Good</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={5}>5 - Excellent</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Author:</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                {/* Add more form fields as necessary */}
                <div className="form-actions">
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/feedbacks')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default FeedbackForm;
