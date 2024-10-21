// src/components/resources/Task/TaskForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, editTask, getTasks } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Task } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';

interface RouteParams {
  id?: string;
}

const TaskForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const { tasks, error } = useSelector((state: RootState) => state.developerDashboard);
  const existingTask = tasks.find((task) => task.id === id);

  const [title, setTitle] = useState(existingTask ? existingTask.title : '');
  const [description, setDescription] = useState(existingTask ? existingTask.description : '');

  useEffect(() => {
    if (!existingTask && id) {
      dispatch(getTasks());
    }
  }, [dispatch, existingTask, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && existingTask) {
      await dispatch(editTask({ ...existingTask, title, description }));
    } else {
      await dispatch(addTask({ title, description }));
    }
    history.push('/developer-dashboard/tasks');
  };

  return (
    <div>
      <h2>{id ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button type="button" onClick={() => history.push('/developer-dashboard/tasks')}>
            Cancel
          </button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default TaskForm;
