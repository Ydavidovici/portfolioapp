// src/features/clientDashboard/components/MessageList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../clientDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { Message } from '../types';

const MessageList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading, error } = useSelector((state: RootState) => state.clientDashboard);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
      <div>
        <h2>Recent Messages</h2>
        {messages.length === 0 ? (
            <p>No messages found.</p>
        ) : (
            <ul>
              {messages.map((msg: Message) => (
                  <li key={msg.id}>
                    <strong>{msg.senderName}</strong>: {msg.content}
                    <br />
                    <small>{new Date(msg.createdAt).toLocaleString()}</small>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

export default MessageList;
