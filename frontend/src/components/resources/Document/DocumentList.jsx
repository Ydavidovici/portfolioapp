// src/components/resources/Document/DocumentList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './DocumentList.css'; // Optional: For styling

const DocumentList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: documents, loading, error } = useFetch('/api/documents');
  const [documentList, setDocumentList] = useState([]);

  // Update documentList when documents data changes
  useEffect(() => {
    if (documents) {
      setDocumentList(documents);
    }
  }, [documents]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await fetch(`/api/documents/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete document');
        }
        // Remove the deleted document from local state to update UI
        setDocumentList((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading documents...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!documentList || documentList.length === 0)
    return <p>No documents found.</p>;

  return (
    <div className="document-list">
      <h2>Documents</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/documents/create">
          <button className="create-button">Add New Document</button>
        </Link>
      )}
      <ul>
        {documentList.map((doc) => (
          <li key={doc.id} className="document-item">
            <h3>{doc.title}</h3>
            <p>{doc.description}</p>
            <p>Author: {doc.author}</p>
            <p>Created At: {new Date(doc.createdAt).toLocaleDateString()}</p>
            {doc.contentUrl && (
              <p>
                <strong>Content:</strong>{' '}
                <a
                  href={doc.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </p>
            )}
            {/* Display other document details as necessary */}
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

DocumentList.propTypes = {
  // Define prop types if props are expected in the future
};

export default DocumentList;
