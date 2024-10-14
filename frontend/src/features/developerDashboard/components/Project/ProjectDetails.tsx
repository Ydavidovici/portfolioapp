// src/features/developerDashboard/components/Project/ProjectDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { getProjects } from '../../developerDashboardSlice';
import { Project } from '../../types';
import { useParams, Link } from 'react-router-dom';
import './ProjectDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const ProjectDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { projects, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const project: Project | undefined = projects.find((proj) => proj.id === id);

    useEffect(() => {
        if (!project) {
            dispatch(getProjects());
        }
    }, [dispatch, project]);

    if (loading) return <p>Loading project details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!project) return <p>Project not found.</p>;

    return (
        <div className="project-details">
            <h2>{project.name}</h2>
            <p>Description: {project.description || 'No description provided.'}</p>
            <p>Status: {project.status}</p>
            <p>Client: {project.client.name} ({project.client.email})</p>

            <h3>Tasks</h3>
            {project.tasks.length === 0 ? (
                <p>No tasks assigned.</p>
            ) : (
                <ul>
                    {project.tasks.map((task) => (
                        <li key={task.id}>
                            <span>{task.title}</span> - {task.completed ? 'Completed' : 'Pending'}
                            {task.dueDate && <span> - Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                        </li>
                    ))}
                </ul>
            )}

            <h3>Feedback</h3>
            {project.feedback.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
                <ul>
                    {project.feedback.map((fb) => (
                        <li key={fb.id}>
                            <strong>Rating:</strong> {fb.rating}/5
                            <br />
                            <strong>Comment:</strong> {fb.comment}
                        </li>
                    ))}
                </ul>
            )}

            {(userRole === 'admin' || userRole === 'developer') && (
                <div className="project-actions">
                    <Link to={`/developer-dashboard/projects/edit/${project.id}`}>
                        <button>Edit Project</button>
                    </Link>
                    {/* Add more admin/developer-specific actions if needed */}
                </div>
            )}
            <Link to="/developer-dashboard/projects">
                <button>Back to Projects</button>
            </Link>
        </div>
    );
};

export default ProjectDetails;
