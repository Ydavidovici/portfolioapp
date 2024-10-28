// src/components/resources/Document/DocumentDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './DocumentDetails.css'; // Optional: For styling

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch document details
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document details');
        }
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await fetch(`/api/documents/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete document');
        }
        // Redirect to documents list after deletion
        navigate('/developer-dashboard/documents');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading document details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!document) return <p>Document not found.</p>;

  const { title, description, author, createdAt, contentUrl } = document;
  const userRole = user?.role;

  return (
    <div className="document-details">
      <h2>{title}</h2>
      <p>
        <strong>Description:</strong>{' '}
        {description || 'No description provided.'}
      </p>
      <p>
        <strong>Author:</strong> {author}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
      </p>
      {contentUrl && (
        <p>
          <strong>Content:</strong>{' '}
          <a href={contentUrl} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
        </p>
      )}
      {/* Display other document details as necessary */}

      <div className="document-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/documents/edit/${document.id}`}>
              <button>Edit Document</button>
            </Link>
            <button onClick={handleDelete}>Delete Document</button>
          </>
        )}
        <Link to="/developer-dashboard/documents">
          <button>Back to Documents</button>
        </Link>
      </div>
    </div>
  );
};

DocumentDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default DocumentDetails;
