// src/components/resources/Task/TaskDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Task } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';

interface RouteParams {
  id: string;
}

const TaskDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.developerDashboard);

  const task: Task | undefined = tasks.find((task) => task.id === id);

  useEffect(() => {
    if (!task) {
      dispatch(getTasks());
    }
  }, [dispatch, task]);

  if (loading) return <p>Loading task details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!task) return <p>Task not found.</p>;

  return (
    <div>
      <h2>Task: {task.title}</h2>
      <p><strong>Description:</strong> {task.description}</p>
      <Link to="/developer-dashboard/tasks">
        <button>Back to Tasks</button>
      </Link>
    </div>
  );
};

export default TaskDetails;
