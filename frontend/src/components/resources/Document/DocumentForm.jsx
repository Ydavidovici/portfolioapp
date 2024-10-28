// src/components/resources/Document/DocumentForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './DocumentForm.css'; // Optional: For styling

const DocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [contentFile, setContentFile] = useState(null);
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing document details if editing
  useEffect(() => {
    if (id) {
      const fetchDocument = async () => {
        try {
          const response = await fetch(`/api/documents/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch document details');
          }
          const data = await response.json();
          setDocument(data);
          setTitle(data.title);
          setDescription(data.description || '');
          setAuthor(data.author);
          // Assuming contentUrl or similar is used to download/view the file
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDocument();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('author', author);
      if (contentFile) {
        formData.append('content', contentFile);
      }

      if (id) {
        // Editing existing document
        response = await fetch(`/api/documents/${id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Creating new document
        response = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      // Redirect to documents list after successful operation
      navigate('/developer-dashboard/documents');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !document) return <p>Document not found.</p>;

  return (
    <div className="document-form">
      <h2>{id ? 'Edit Document' : 'Create Document'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="doc-title">Title:</label>
          <input
            id="doc-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="doc-description">Description (optional):</label>
          <textarea
            id="doc-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="doc-author">Author:</label>
          <input
            id="doc-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="doc-content">Content (optional):</label>
          <input
            id="doc-content"
            type="file"
            accept=".pdf,.doc,.docx,.txt" // Adjust accepted file types as needed
            onChange={(e) => setContentFile(e.target.files[0])}
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/documents')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

DocumentForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default DocumentForm;
