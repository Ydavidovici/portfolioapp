// src/components/resources/Document/DocumentDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDocuments } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Document } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';
import './DocumentDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const DocumentDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { documents, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const document: Document | undefined = documents.find((doc) => doc.id === id);

    useEffect(() => {
        if (!document) {
            dispatch(getDocuments());
        }
    }, [dispatch, document]);

    if (loading) return <p>Loading document details...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!document) return <p>Document not found.</p>;

    return (
        <div className="document-details">
            <h2>{document.title}</h2>
            <p><strong>Description:</strong> {document.description || 'No description provided.'}</p>
            <p><strong>Author:</strong> {document.author}</p>
            <p><strong>Created At:</strong> {new Date(document.createdAt).toLocaleDateString()}</p>
            {/* Display other document details as necessary */}

            <div className="document-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/documents/edit/${document.id}`}>
                            <button>Edit Document</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/documents">
                    <button>Back to Documents</button>
                </Link>
            </div>
        </div>
    );
};

export default DocumentDetails;
