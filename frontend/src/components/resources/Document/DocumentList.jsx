// src/components/resources/Document/DocumentList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDocuments, removeDocument } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Document } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';
import './DocumentList.css'; // Optional: For styling

const DocumentList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { documents, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    useEffect(() => {
        dispatch(getDocuments());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            dispatch(removeDocument(id));
        }
    };

    if (loading) return <p>Loading documents...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (documents.length === 0) return <p>No documents found.</p>;

    return (
        <div className="document-list">
            <h2>Documents</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/documents/create">
                    <button className="create-button">Add New Document</button>
                </Link>
            )}
            <ul>
                {documents.map((doc: Document) => (
                    <li key={doc.id} className="document-item">
                        <h3>{doc.title}</h3>
                        <p>{doc.description}</p>
                        <p>Author: {doc.author}</p>
                        <p>Created At: {new Date(doc.createdAt).toLocaleDateString()}</p>
                        <div className="document-actions">
                            <Link to={`/developer-dashboard/documents/${doc.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/documents/edit/${doc.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(doc.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;
