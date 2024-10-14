// src/components/resources/Checklist/ChecklistForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChecklist, editChecklist, getChecklists } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Checklist } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';
import './ChecklistForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const ChecklistForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { checklists, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingChecklist = checklists.find((cl) => cl.id === id);

    const [title, setTitle] = useState(existingChecklist ? existingChecklist.title : '');
    const [description, setDescription] = useState(existingChecklist ? existingChecklist.description || '' : '');
    const [status, setStatus] = useState<Checklist['status']>(existingChecklist ? existingChecklist.status : 'active');

    useEffect(() => {
        if (!existingChecklist && id) {
            dispatch(getChecklists());
        }
    }, [dispatch, existingChecklist, id]);

    useEffect(() => {
        if (existingChecklist) {
            setTitle(existingChecklist.title);
            setDescription(existingChecklist.description || '');
            setStatus(existingChecklist.status);
        }
    }, [existingChecklist]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingChecklist) {
            await dispatch(
                editChecklist({
                    ...existingChecklist,
                    title,
                    description,
                    status,
                })
            );
        } else {
            await dispatch(
                addChecklist({
                    title,
                    description,
                    status,
                })
            );
        }
        history.push('/developer-dashboard/checklists');
    };

    return (
        <div className="checklist-form">
            <h2>{id ? 'Edit Checklist' : 'Create Checklist'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description (optional):</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as Checklist['status'])}>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                {/* Add more form fields as necessary */}
                <div className="form-actions">
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/checklists')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ChecklistForm;
