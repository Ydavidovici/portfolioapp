// src/features/clientDashboard/pages/ClientDashboard.tsx

import React from 'react';
import MessageList from '../components/MessageList';
import DocumentList from '../components/DocumentList';

const ClientDashboard: React.FC = () => {
    return (
        <div>
            <h1>Client Dashboard</h1>
            <MessageList />
            <DocumentList />
        </div>
    );
};

export default ClientDashboard;
