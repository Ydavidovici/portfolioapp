// src/features/client/commonComponents/TaskForm.tsx
import React, { useEffect, useState } from 'react';
import { Task, createTask, updateTask } from '@/store/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '@/store/slices/projectSlice';
import { RootState } from '@/store';
import { toast } from 'react-toastify';

interface TaskFormProps {
  task?: Task;
  onClose?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const { projects, isLoading: projectsLoading } = useSelector((state: RootState) => state.projects);

  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [projectId, setProjectId] = useState(task ? task.projectId : '');
  const [assignedTo, setAssignedTo] = useState(task ? task.assignedTo : '');
  const [status, setStatus] = useState<Task['status']>(task ? task.status : 'pending');

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !projectId || !assignedTo || !status) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (task) {
        // Update existing task
        await dispatch(
          updateTask({ id: task.id, data: { title, description, projectId, assignedTo, status } })
        ).unwrap();
        toast.success('Task updated successfully');
        if (onClose) onClose();
      } else {
        // Create new task
        await dispatch(createTask({ title, description, projectId, assignedTo, status })).unwrap();
        toast.success('Task created successfully');
        setTitle('');
        setDescription('');
        setProjectId('');
        setAssignedTo('');
        setStatus('pending');
      }
    } catch (error: any) {
      toast.error(error || 'Failed to submit form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter task title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter task description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectId">
          Project
        </label>
        <select
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedTo">
          Assign To (User ID)
        </label>
        <input
          id="assignedTo"
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter user ID"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task['status'])}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
        {task && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
