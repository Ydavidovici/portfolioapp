// src/components/resources/Project/ProjectList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './ProjectList.css'; // Optional: For styling

const ProjectList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: projects, loading, error } = useFetch('/api/projects');
  const [projectList, setProjectList] = useState([]);

  // Update projectList when projects data changes
  useEffect(() => {
    if (projects) {
      setProjectList(projects);
    }
  }, [projects]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
        // Remove the deleted project from local state to update UI
        setProjectList((prevProjects) =>
          prevProjects.filter((proj) => proj.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading projects...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!projectList || projectList.length === 0)
    return <p>No projects found.</p>;

  return (
    <div className="project-list">
      <h2>Projects</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/projects/create">
          <button className="create-button">Add New Project</button>
        </Link>
      )}
      <ul>
        {projectList.map((project) => (
          <li key={project.id} className="project-item">
            <h3>{project.title}</h3>
            <p>
              <strong>Client:</strong> {project.client.name}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {new Date(project.start_date).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{' '}
              {new Date(project.end_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {project.status}
            </p>
            <div className="project-actions">
              <Link to={`/developer-dashboard/projects/${project.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link to={`/developer-dashboard/projects/edit/${project.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(project.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProjectList.propTypes = {
  // Define prop types if props are expected in the future
};

export default ProjectList;
