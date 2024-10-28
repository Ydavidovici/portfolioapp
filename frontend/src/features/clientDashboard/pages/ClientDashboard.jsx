// src/features/clientdashboard/pages/ClientDashboard.jsx

import React from 'react';
import ClientNavbar from '../components/ClientNavbar';
// import './ClientDashboard.css'; // Optional: For layout styling

const ClientDashboard = () => {
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
