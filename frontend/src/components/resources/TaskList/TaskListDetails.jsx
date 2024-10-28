// src/features/developerDashboard/components/TaskList/TaskListDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';
import PropTypes from 'prop-types';
// import './TaskListDetails.css'; // Optional: For styling

const TaskListDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [taskList, setTaskList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task list details
  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const response = await fetch(`/api/task-lists/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task list details');
        }
        const data = await response.json();
        setTaskList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskList();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task list?')) {
      try {
        const response = await fetch(`/api/task-lists/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete task list');
        }
        // Redirect to task lists after deletion
        navigate('/developer-dashboard/task-lists');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading task list details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!taskList) return <p>Task List not found.</p>;

  const { name, projectId } = taskList;
  const userRole = user?.role;

  return (
    <div className="tasklist-details">
      <h2>{name}</h2>
      <p>Project ID: {projectId}</p>
      {/* Display associated tasks if any */}
      {/* Assuming tasks are fetched and available */}
      {/* You can enhance this section to display related tasks */}
      <div className="tasklist-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/task-lists/edit/${taskList.id}`}>
              <button>Edit Task List</button>
            </Link>
            <button onClick={handleDelete}>Delete Task List</button>
          </>
        )}
        <Link to="/developer-dashboard/task-lists">
          <button>Back to Task Lists</button>
        </Link>
      </div>
    </div>
  );
};

TaskListDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default TaskListDetails;
