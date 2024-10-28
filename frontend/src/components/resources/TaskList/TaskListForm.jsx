// src/features/developerDashboard/components/TaskList/TaskListForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';
import PropTypes from 'prop-types';
// import './TaskListForm.css'; // Optional: For styling

const TaskListForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [taskList, setTaskList] = useState(null);
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing task list details if editing
  useEffect(() => {
    if (id) {
      const fetchTaskList = async () => {
        try {
          const response = await fetch(`/api/task-lists/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch task list details');
          }
          const data = await response.json();
          setTaskList(data);
          setName(data.name);
          setProjectId(data.projectId);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTaskList();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        name,
        projectId,
      };

      if (id) {
        // Editing existing task list
        response = await fetch(`/api/task-lists/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new task list
        response = await fetch('/api/task-lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save task list');
      }

      // Redirect to task lists after successful operation
      navigate('/developer-dashboard/task-lists');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !taskList) return <p>Task List not found.</p>;

  return (
    <div className="tasklist-form">
      <h2>{id ? 'Edit Task List' : 'Create Task List'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tasklist-name">Name:</label>
          <input
            id="tasklist-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tasklist-project-id">Project ID:</label>
          <input
            id="tasklist-project-id"
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/task-lists')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

TaskListForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default TaskListForm;
