// src/components/resources/ChecklistItem/ChecklistItemForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChecklistItem, editChecklistItem, getChecklistItems } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { ChecklistItem } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';
import './ChecklistItemForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const ChecklistItemForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { checklistItems, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingItem = checklistItems.find((item) => item.id === id);

    const [title, setTitle] = useState(existingItem ? existingItem.title : '');
    const [description, setDescription] = useState(existingItem ? existingItem.description || '' : '');
    const [status, setStatus] = useState<ChecklistItem['status']>(existingItem ? existingItem.status : 'active');

    useEffect(() => {
        if (!existingItem && id) {
            dispatch(getChecklistItems());
        }
    }, [dispatch, existingItem, id]);

    useEffect(() => {
        if (existingItem) {
            setTitle(existingItem.title);
            setDescription(existingItem.description || '');
            setStatus(existingItem.status);
        }
    }, [existingItem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingItem) {
            await dispatch(
                editChecklistItem({
                    ...existingItem,
                    title,
                    description,
                    status,
                })
            );
        } else {
            await dispatch(
                addChecklistItem({
                    title,
                    description,
                    status,
                })
            );
        }
        history.push('/developer-dashboard/checklist-items');
    };

    return (
        <div className="checklistitem-form">
            <h2>{id ? 'Edit Checklist Item' : 'Create Checklist Item'}</h2>
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
                    <select value={status} onChange={(e) => setStatus(e.target.value as ChecklistItem['status'])}>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                {/* Add more form fields as necessary */}
                <div className="form-actions">
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/checklist-items')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ChecklistItemForm;
