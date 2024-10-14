// src/features/clientDashboard/components/DocumentList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDocuments } from '../clientDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { Document } from '../types';

const DocumentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error } = useSelector((state: RootState) => state.clientDashboard);

  useEffect(() => {
    dispatch(getDocuments());
  }, [dispatch]);

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
      <div>
        <h2>Recent Documents</h2>
        {documents.length === 0 ? (
            <p>No documents found.</p>
        ) : (
            <ul>
              {documents.map((doc: Document) => (
                  <li key={doc.id}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      {doc.title}
                    </a>
                    <br />
                    <small>Uploaded at: {new Date(doc.uploadedAt).toLocaleString()}</small>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

export default DocumentList;
