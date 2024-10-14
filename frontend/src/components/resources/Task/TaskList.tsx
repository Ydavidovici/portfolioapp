// src/components/resources/Task/TaskList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, removeTask } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Task } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.developerDashboard);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(removeTask(id));
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;
  if (tasks.length === 0) return <p>No tasks found.</p>;

  return (
    <div>
      <h2>Tasks</h2>
      <Link to="/developer-dashboard/tasks/create">
        <button>Add New Task</button>
      </Link>
      <ul>
        {tasks.map((task: Task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div>
              <Link to={`/developer-dashboard/tasks/${task.id}`}>
                <button>View Details</button>
              </Link>
              <Link to={`/developer-dashboard/tasks/edit/${task.id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
