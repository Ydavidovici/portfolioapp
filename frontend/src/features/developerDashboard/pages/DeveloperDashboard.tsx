// src/features/developerDashboard/pages/DeveloperDashboard.tsx

import React from 'react';
import DeveloperNavbar from '../components/DeveloperNavbar';
import DeveloperSidebar from '../components/DeveloperSidebar';
import {
    ProjectList,
    BoardList,
    CalendarEntryList,
    ChecklistList,
    ChecklistItemList,
    DocumentList,
    FeedbackList,
    InvoiceList,
    MessageList,
    NoteList,
    PaymentList,
    QuickBooksTokenList,
    ReminderList,
    TaskList,
    TaskListList,
} from '../../../components/resources';
import './DeveloperDashboard.css'; // Optional: For layout styling

const DeveloperDashboard: React.FC = () => {
    return (
      <div className="developer-dashboard">
          <DeveloperNavbar />
          <div className="developer-container">
              <DeveloperSidebar />
              <main className="developer-main">
                  <h1>Developer Dashboard</h1>

                  {/* Project Management */}
                  <section>
                      <h2>Projects</h2>
                      <ProjectList />
                  </section>

                  {/* Shared Resource Components */}
                  <section>
                      <BoardList />
                      <CalendarEntryList />
                      <ChecklistList />
                      <ChecklistItemList />
                      <DocumentList />
                      <FeedbackList />
                      <InvoiceList />
                      <MessageList />
                      <NoteList />
                      <PaymentList />
                      <QuickBooksTokenList />
                      <ReminderList />
                      <TaskList />
                      <TaskListList />
                  </section>
              </main>
          </div>
      </div>
    );
};

export default DeveloperDashboard;
