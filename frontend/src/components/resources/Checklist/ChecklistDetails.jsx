// src/components/resources/Checklist/ChecklistDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChecklists } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Checklist } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';
import './ChecklistDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const ChecklistDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { checklists, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const checklist: Checklist | undefined = checklists.find((cl) => cl.id === id);

    useEffect(() => {
        if (!checklist) {
            dispatch(getChecklists());
        }
    }, [dispatch, checklist]);

    if (loading) return <p>Loading checklist details...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!checklist) return <p>Checklist not found.</p>;

    return (
        <div className="checklist-details">
            <h2>{checklist.title}</h2>
            <p><strong>Description:</strong> {checklist.description || 'No description provided.'}</p>
            <p><strong>Status:</strong> {checklist.status}</p>
            {/* Display other checklist details as necessary */}

            <div className="checklist-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/checklists/edit/${checklist.id}`}>
                            <button>Edit Checklist</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/checklists">
                    <button>Back to Checklists</button>
                </Link>
            </div>
        </div>
    );
};

export default ChecklistDetails;
