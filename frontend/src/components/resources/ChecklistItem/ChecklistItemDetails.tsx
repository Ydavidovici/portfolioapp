// src/components/resources/ChecklistItem/ChecklistItemDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChecklistItems } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { ChecklistItem } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';
import './ChecklistItemDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const ChecklistItemDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { checklistItems, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const checklistItem: ChecklistItem | undefined = checklistItems.find((item) => item.id === id);

    useEffect(() => {
        if (!checklistItem) {
            dispatch(getChecklistItems());
        }
    }, [dispatch, checklistItem]);

    if (loading) return <p>Loading checklist item details...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!checklistItem) return <p>Checklist item not found.</p>;

    return (
        <div className="checklistitem-details">
            <h2>{checklistItem.title}</h2>
            <p><strong>Description:</strong> {checklistItem.description || 'No description provided.'}</p>
            <p><strong>Status:</strong> {checklistItem.status}</p>
            {/* Display other checklist item details as necessary */}

            <div className="checklistitem-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/checklist-items/edit/${checklistItem.id}`}>
                            <button>Edit Checklist Item</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/checklist-items">
                    <button>Back to Checklist Items</button>
                </Link>
            </div>
        </div>
    );
};

export default ChecklistItemDetails;
