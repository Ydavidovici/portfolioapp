// src/components/resources/Checklist/ChecklistList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChecklists, removeChecklist } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Checklist } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';
import './ChecklistList.css'; // Optional: For styling

const ChecklistList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { checklists, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    useEffect(() => {
        dispatch(getChecklists());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this checklist?')) {
            dispatch(removeChecklist(id));
        }
    };

    if (loading) return <p>Loading checklists...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (checklists.length === 0) return <p>No checklists found.</p>;

    return (
        <div className="checklist-list">
            <h2>Checklists</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/checklists/create">
                    <button className="create-button">Add New Checklist</button>
                </Link>
            )}
            <ul>
                {checklists.map((checklist: Checklist) => (
                    <li key={checklist.id} className="checklist-item">
                        <h3>{checklist.title}</h3>
                        <p>{checklist.description}</p>
                        <p>Status: {checklist.status}</p>
                        <div className="checklist-actions">
                            <Link to={`/developer-dashboard/checklists/${checklist.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/checklists/edit/${checklist.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(checklist.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChecklistList;
