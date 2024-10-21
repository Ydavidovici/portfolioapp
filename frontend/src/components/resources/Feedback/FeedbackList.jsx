// src/components/resources/Feedback/FeedbackList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedbacks, removeFeedback } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Feedback } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';
import './FeedbackList.css'; // Optional: For styling

const FeedbackList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { feedbacks, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    useEffect(() => {
        dispatch(getFeedbacks());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            dispatch(removeFeedback(id));
        }
    };

    if (loading) return <p>Loading feedbacks...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (feedbacks.length === 0) return <p>No feedbacks found.</p>;

    return (
        <div className="feedback-list">
            <h2>Feedbacks</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/feedbacks/create">
                    <button className="create-button">Add New Feedback</button>
                </Link>
            )}
            <ul>
                {feedbacks.map((fb: Feedback) => (
                    <li key={fb.id} className="feedback-item">
                        <h3>{fb.title}</h3>
                        <p>{fb.comment}</p>
                        <p>Rating: {fb.rating}/5</p>
                        <p>Author: {fb.author}</p>
                        <p>Created At: {new Date(fb.createdAt).toLocaleDateString()}</p>
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

export default FeedbackList;
