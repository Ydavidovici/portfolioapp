// src/components/resources/Project/ProjectDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './ProjectDetails.css'; // Optional: For styling

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
        // Redirect to projects list after deletion
        navigate('/developer-dashboard/projects');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading project details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!project) return <p>Project not found.</p>;

  const { title, description, client, start_date, end_date, status } = project;
  const userRole = user?.role;

  return (
    <div className="project-details">
      <h2>{title}</h2>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Client:</strong> {client.name}
      </p>
      <p>
        <strong>Start Date:</strong> {new Date(start_date).toLocaleDateString()}
      </p>
      <p>
        <strong>End Date:</strong> {new Date(end_date).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      {/* Display other project details as necessary */}

      <div className="project-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/projects/edit/${project.id}`}>
              <button>Edit Project</button>
            </Link>
            <button onClick={handleDelete}>Delete Project</button>
          </>
        )}
        <Link to="/developer-dashboard/projects">
          <button>Back to Projects</button>
        </Link>
      </div>
    </div>
  );
};

ProjectDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default ProjectDetails;
