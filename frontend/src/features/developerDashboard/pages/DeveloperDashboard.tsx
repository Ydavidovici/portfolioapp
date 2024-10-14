// src/features/developerDashboard/pages/DeveloperDashboard.tsx

import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import DeveloperNavbar from '../components/DeveloperNavbar';
import DeveloperSidebar from '../components/DeveloperSidebar';

// Import Project Components
import ProjectList from '../components/Project/ProjectList';
import ProjectForm from '../components/Project/ProjectForm';
import ProjectDetails from '../components/Project/ProjectDetails';

// Import Message Components
import MessageList from '../components/Message/MessageList';
import MessageForm from '../components/Message/MessageForm';
import MessageDetails from '../components/Message/MessageDetails';

// Import other resource components similarly...

import './DeveloperDashboard.css'; // Optional: For styling

const DeveloperDashboard: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <div className="developer-dashboard">
            <DeveloperNavbar />
            <div className="dashboard-container">
                <DeveloperSidebar />
                <main className="dashboard-main">
                    <Switch>
                        <Route exact path={path}>
                            <h2>Welcome to the Developer Dashboard</h2>
                            <ProjectList />
                            <MessageList />
                            {/* Include other lists or summaries as needed */}
                        </Route>

                        {/* Project Routes */}
                        <Route exact path={`${path}/projects`}>
                            <ProjectList />
                        </Route>
                        <Route exact path={`${path}/projects/create`}>
                            <ProjectForm />
                        </Route>
                        <Route exact path={`${path}/projects/edit/:id`}>
                            <ProjectForm />
                        </Route>
                        <Route exact path={`${path}/projects/:id`}>
                            <ProjectDetails />
                        </Route>

                        {/* Message Routes */}
                        <Route exact path={`${path}/messages`}>
                            <MessageList />
                        </Route>
                        <Route exact path={`${path}/messages/create`}>
                            <MessageForm />
                        </Route>
                        <Route exact path={`${path}/messages/edit/:id`}>
                            <MessageForm />
                        </Route>
                        <Route exact path={`${path}/messages/:id`}>
                            <MessageDetails />
                        </Route>

                        {/* Add Routes for other resources similarly... */}

                        {/* Redirect unknown routes */}
                        <Redirect to={path} />
                    </Switch>
                </main>
            </div>
        </div>
    );
};

export default DeveloperDashboard;
