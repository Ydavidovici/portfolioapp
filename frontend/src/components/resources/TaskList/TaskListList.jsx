// src/features/developerDashboard/components/TaskList/TaskListList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';
import useFetch from '../../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './TaskListList.css'; // Optional: For styling

const TaskListList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: taskLists, loading, error } = useFetch('/api/task-lists');
  const [taskListArray, setTaskListArray] = useState([]);

  // Update taskListArray when taskLists data changes
  useEffect(() => {
    if (taskLists) {
      setTaskListArray(taskLists);
    }
  }, [taskLists]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task list?')) {
      try {
        const response = await fetch(`/api/task-lists/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete task list');
        }
        // Remove the deleted task list from local state to update UI
        setTaskListArray((prevTaskLists) =>
          prevTaskLists.filter((tl) => tl.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading task lists...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!taskListArray || taskListArray.length === 0)
    return <p>No task lists found.</p>;

  return (
    <div className="tasklist-list">
      <h2>Task Lists</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/task-lists/create">
          <button className="create-button">Add New Task List</button>
        </Link>
      )}
      <ul>
        {taskListArray.map((taskList) => (
          <li key={taskList.id} className="tasklist-item">
            <h3>{taskList.name}</h3>
            <p>Project ID: {taskList.projectId}</p>
            <div className="tasklist-actions">
              <Link to={`/developer-dashboard/task-lists/${taskList.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link
                    to={`/developer-dashboard/task-lists/edit/${taskList.id}`}
                  >
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(taskList.id)}>
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

TaskListList.propTypes = {
  // Define prop types if props are expected in the future
};

export default TaskListList;
