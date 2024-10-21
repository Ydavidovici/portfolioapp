// src/components/resources/ChecklistItem/ChecklistItemList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChecklistItems, removeChecklistItem } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { ChecklistItem } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';
import './ChecklistItemList.css'; // Optional: For styling

const ChecklistItemList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { checklistItems, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    useEffect(() => {
        dispatch(getChecklistItems());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this checklist item?')) {
            dispatch(removeChecklistItem(id));
        }
    };

    if (loading) return <p>Loading checklist items...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (checklistItems.length === 0) return <p>No checklist items found.</p>;

    return (
        <div className="checklistitem-list">
            <h2>Checklist Items</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/checklist-items/create">
                    <button className="create-button">Add New Checklist Item</button>
                </Link>
            )}
            <ul>
                {checklistItems.map((item: ChecklistItem) => (
                    <li key={item.id} className="checklistitem-item">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>Status: {item.status}</p>
                        <div className="checklistitem-actions">
                            <Link to={`/developer-dashboard/checklist-items/${item.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/checklist-items/edit/${item.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChecklistItemList;
