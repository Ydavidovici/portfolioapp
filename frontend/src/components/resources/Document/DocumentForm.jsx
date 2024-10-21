// src/components/resources/Document/DocumentForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDocument, editDocument, getDocuments } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Document } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';
import './DocumentForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const DocumentForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { documents, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingDocument = documents.find((doc) => doc.id === id);

    const [title, setTitle] = useState(existingDocument ? existingDocument.title : '');
    const [description, setDescription] = useState(existingDocument ? existingDocument.description || '' : '');
    const [author, setAuthor] = useState(existingDocument ? existingDocument.author : '');

    useEffect(() => {
        if (!existingDocument && id) {
            dispatch(getDocuments());
        }
    }, [dispatch, existingDocument, id]);

    useEffect(() => {
        if (existingDocument) {
            setTitle(existingDocument.title);
            setDescription(existingDocument.description || '');
            setAuthor(existingDocument.author);
        }
    }, [existingDocument]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingDocument) {
            await dispatch(
                editDocument({
                    ...existingDocument,
                    title,
                    description,
                    author,
                })
            );
        } else {
            await dispatch(
                addDocument({
                    title,
                    description,
                    author,
                    createdAt: new Date().toISOString(), // Assuming backend handles this, adjust as necessary
                })
            );
        }
        history.push('/developer-dashboard/documents');
    };

    return (
        <div className="document-form">
            <h2>{id ? 'Edit Document' : 'Create Document'}</h2>
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
                    <label>Author:</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                {/* Add more form fields as necessary */}
                <div className="form-actions">
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/documents')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default DocumentForm;
