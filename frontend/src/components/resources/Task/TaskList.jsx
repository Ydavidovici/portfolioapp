// src/components/resources/Task/TaskList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './TaskList.css'; // Optional: For styling

const TaskList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: tasks, loading, error } = useFetch('/api/tasks');
  const [taskList, setTaskList] = useState([]);

  // Update taskList when tasks data changes
  useEffect(() => {
    if (tasks) {
      setTaskList(tasks);
    }
  }, [tasks]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        // Remove the deleted task from local state to update UI
        setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading tasks...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!taskList || taskList.length === 0) return <p>No tasks found.</p>;

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/tasks/create">
          <button className="create-button">Add New Task</button>
        </Link>
      )}
      <ul>
        {taskList.map((task) => (
          <li key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-actions">
              <Link to={`/developer-dashboard/tasks/${task.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link to={`/developer-dashboard/tasks/edit/${task.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

TaskList.propTypes = {
  // Define prop types if props are expected in the future
};

export default TaskList;
