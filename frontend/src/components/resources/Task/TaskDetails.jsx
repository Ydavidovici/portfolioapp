// src/components/resources/Task/TaskDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './TaskDetails.css'; // Optional: For styling

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task details');
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        // Redirect to tasks list after deletion
        navigate('/developer-dashboard/tasks');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading task details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!task) return <p>Task not found.</p>;

  const { title, description } = task;
  const userRole = user?.role;

  return (
    <div className="task-details">
      <h2>Task: {title}</h2>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <div className="task-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/tasks/edit/${task.id}`}>
              <button>Edit Task</button>
            </Link>
            <button onClick={handleDelete}>Delete Task</button>
          </>
        )}
        <Link to="/developer-dashboard/tasks">
          <button>Back to Tasks</button>
        </Link>
      </div>
    </div>
  );
};

TaskDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default TaskDetails;
