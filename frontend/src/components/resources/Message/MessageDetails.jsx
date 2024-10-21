// src/features/developerDashboard/components/Message/MessageDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { getMessages } from '../../developerDashboardSlice';
import { Message } from '../../types';
import { useParams, Link } from 'react-router-dom';
import './MessageDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const MessageDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { messages, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const message: Message | undefined = messages.find((msg) => msg.id === id);

    useEffect(() => {
        if (!message) {
            dispatch(getMessages());
        }
    }, [dispatch, message]);

    if (loading) return <p>Loading message details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!message) return <p>Message not found.</p>;

    return (
        <div className="message-details">
            <h2>Message Details</h2>
            <p>
                <strong>Sender:</strong> {message.senderName}
            </p>
            <p>
                <strong>Content:</strong> {message.content}
            </p>
            <p>
                <strong>Received At:</strong> {new Date(message.createdAt).toLocaleString()}
            </p>
            <div className="message-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/messages/edit/${message.id}`}>
                            <button>Edit Message</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/messages">
                    <button>Back to Messages</button>
                </Link>
            </div>
        </div>
    );
};

export default MessageDetails;
