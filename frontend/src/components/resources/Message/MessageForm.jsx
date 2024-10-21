// src/features/developerDashboard/components/Message/MessageForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, editMessage, getMessages } from '../../developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { Message } from '../../types';
import { useHistory, useParams } from 'react-router-dom';
import './MessageForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const MessageForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { messages, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingMessage = messages.find((msg) => msg.id === id);

    const [senderName, setSenderName] = useState(existingMessage ? existingMessage.senderName : '');
    const [content, setContent] = useState(existingMessage ? existingMessage.content : '');

    useEffect(() => {
        if (!existingMessage && id) {
            dispatch(getMessages());
        }
    }, [dispatch, existingMessage, id]);

    useEffect(() => {
        if (existingMessage) {
            setSenderName(existingMessage.senderName);
            setContent(existingMessage.content);
        }
    }, [existingMessage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingMessage) {
            await dispatch(
                editMessage({
                    ...existingMessage,
                    senderName,
                    content,
                })
            );
        } else {
            await dispatch(
                addMessage({
                    senderName,
                    content,
                })
            );
        }
        history.push('/developer-dashboard/messages');
    };

    return (
        <div className="message-form">
            <h2>{id ? 'Edit Message' : 'Create Message'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Sender Name:</label>
                    <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div>
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/messages')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default MessageForm;
