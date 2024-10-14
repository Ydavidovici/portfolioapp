// src/features/developerDashboard/components/Message/MessageList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, removeMessage } from '../../developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { Message } from '../../types';
import { Link } from 'react-router-dom';
import './MessageList.css'; // Optional: For styling

const MessageList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { messages, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    useEffect(() => {
        dispatch(getMessages());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            dispatch(removeMessage(id));
        }
    };

    if (loading) return <p>Loading messages...</p>;
    if (error) return <p>Error: {error}</p>;
    if (messages.length === 0) return <p>No messages found.</p>;

    return (
        <div className="message-list">
            <h2>Recent Messages</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/messages/create">
                    <button>Add New Message</button>
                </Link>
            )}
            <ul>
                {messages.map((msg: Message) => (
                    <li key={msg.id} className="message-item">
                        <strong>{msg.senderName}</strong>: {msg.content}
                        <br />
                        <small>{new Date(msg.createdAt).toLocaleString()}</small>
                        {(userRole === 'admin' || userRole === 'developer') && (
                            <div className="message-actions">
                                <Link to={`/developer-dashboard/messages/${msg.id}`}>
                                    <button>View Details</button>
                                </Link>
                                <Link to={`/developer-dashboard/messages/edit/${msg.id}`}>
                                    <button>Edit</button>
                                </Link>
                                <button onClick={() => handleDelete(msg.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;
