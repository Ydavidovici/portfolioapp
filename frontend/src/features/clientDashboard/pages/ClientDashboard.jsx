// src/features/clientdashboard/pages/ClientDashboard.tsx

import React from 'react';
import ClientNavbar from '../components/ClientNavbar';
import ClientSidebar from '../components/ClientSidebar';
import MessageList from '../components/MessageList';
import DocumentList from '../components/DocumentList';
import './ClientDashboard.css'; // Optional: For layout styling

const ClientDashboard: React.FC = () => {
  return (
    <div className="client-dashboard">
      <ClientNavbar />
      <div className="client-container">
        <ClientSidebar />
        <main className="client-main">
          <h1>Client Dashboard</h1>

          {/* Messages Section */}
          <section>
            <MessageList />
          </section>

          {/* Documents Section */}
          <section>
            <DocumentList />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
