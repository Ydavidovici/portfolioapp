// src/components/resources/Feedback/FeedbackDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFeedbacks } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Feedback } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';
import './FeedbackDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const FeedbackDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { feedbacks, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const feedback: Feedback | undefined = feedbacks.find((fb) => fb.id === id);

    useEffect(() => {
        if (!feedback) {
            dispatch(getFeedbacks());
        }
    }, [dispatch, feedback]);

    if (loading) return <p>Loading feedback details...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!feedback) return <p>Feedback not found.</p>;

    return (
        <div className="feedback-details">
            <h2>{feedback.title}</h2>
            <p><strong>Comment:</strong> {feedback.comment}</p>
            <p><strong>Rating:</strong> {feedback.rating}/5</p>
            <p><strong>Author:</strong> {feedback.author}</p>
            <p><strong>Created At:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</p>
            {/* Display other feedback details as necessary */}

            <div className="feedback-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/feedbacks/edit/${feedback.id}`}>
                            <button>Edit Feedback</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/feedbacks">
                    <button>Back to Feedbacks</button>
                </Link>
            </div>
        </div>
    );
};

export default FeedbackDetails;
