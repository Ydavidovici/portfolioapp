// src/features/developerDashboard/components/Project/ProjectList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, removeProject } from '../../developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { Project } from '../../types';
import { Link } from 'react-router-dom';
import './ProjectList.css'; // Optional: For styling

const ProjectList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { projects, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    useEffect(() => {
        dispatch(getProjects());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            dispatch(removeProject(id));
        }
    };

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p>Error: {error}</p>;
    if (projects.length === 0) return <p>No projects found.</p>;

    return (
        <div className="project-list">
            <h2>Projects</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/projects/create">
                    <button>Add New Project</button>
                </Link>
            )}
            <ul>
                {projects.map((project: Project) => (
                    <li key={project.id} className="project-item">
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <p>Status: {project.status}</p>
                        <p>Client: {project.client.name}</p>
                        <div className="project-actions">
                            <Link to={`/developer-dashboard/projects/${project.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/projects/edit/${project.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(project.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
