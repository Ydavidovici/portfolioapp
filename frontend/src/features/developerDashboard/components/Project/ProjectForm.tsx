// src/features/developerDashboard/components/Project/ProjectForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProject, editProject, getProjects } from '../../developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { Project } from '../../types';
import { useHistory, useParams } from 'react-router-dom';
import './ProjectForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const ProjectForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { projects, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingProject = projects.find((proj) => proj.id === id);

    const [name, setName] = useState(existingProject ? existingProject.name : '');
    const [description, setDescription] = useState(existingProject ? existingProject.description || '' : '');
    const [status, setStatus] = useState<Project['status']>(existingProject ? existingProject.status : 'active');
    const [clientId, setClientId] = useState<string>(existingProject ? existingProject.client.id : '');

    useEffect(() => {
        if (!existingProject && id) {
            dispatch(getProjects());
        }
    }, [dispatch, existingProject, id]);

    useEffect(() => {
        if (existingProject) {
            setName(existingProject.name);
            setDescription(existingProject.description || '');
            setStatus(existingProject.status);
            setClientId(existingProject.client.id);
        }
    }, [existingProject]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingProject) {
            await dispatch(
                editProject({
                    ...existingProject,
                    name,
                    description,
                    status,
                    // Assuming client association remains unchanged
                })
            );
        } else {
            await dispatch(
                addProject({
                    name,
                    description,
                    status,
                    clientId, // Ensure clientId is correctly associated
                })
            );
        }
        history.push('/developer-dashboard/projects');
    };

    return (
        <div className="project-form">
            <h2>{id ? 'Edit Project' : 'Create Project'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Description (optional):</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as Project['status'])}>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                    </select>
                </div>
                {/* Add client selection if necessary */}
                <div>
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/projects')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ProjectForm;
