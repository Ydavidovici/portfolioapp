// src/components/resources/Project/ProjectForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ProjectForm.css'; // Optional: For styling

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing project details if editing
  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch project details');
          }
          const data = await response.json();
          setProject(data);
          setTitle(data.title);
          setDescription(data.description);
          setClientId(data.client_id);
          setStartDate(data.start_date);
          setEndDate(data.end_date);
          setStatus(data.status);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        title,
        description,
        client_id: clientId,
        start_date: startDate,
        end_date: endDate,
        status,
      };

      if (id) {
        // Editing existing project
        response = await fetch(`/api/projects/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new project
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            created_at: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      // Redirect to projects list after successful operation
      navigate('/developer-dashboard/projects');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !project) return <p>Project not found.</p>;

  return (
    <div className="project-form">
      <h2>{id ? 'Edit Project' : 'Create Project'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project-title">Title:</label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="project-description">Description:</label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="project-client">Client:</label>
          <select
            id="project-client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Select Client</option>
            {/* Replace with actual client options */}
            <option value="1">Client A</option>
            <option value="2">Client B</option>
            <option value="3">Client C</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="project-start-date">Start Date:</label>
          <input
            id="project-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="project-end-date">End Date:</label>
          <input
            id="project-end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="project-status">Status:</label>
          <select
            id="project-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="on hold">On Hold</option>
          </select>
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/projects')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

ProjectForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default ProjectForm;
