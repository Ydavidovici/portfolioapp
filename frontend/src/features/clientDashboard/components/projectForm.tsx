// src/features/client/commonComponents/ProjectForm.tsx
import React, { useEffect, useState } from 'react';
import { Project, createProject, updateProject } from '@/store/slices/projectSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface ProjectFormProps {
  project?: Project;
  onClose?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(project ? project.name : '');
  const [description, setDescription] = useState(project ? project.description : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (project) {
        // Update existing project
        await dispatch(updateProject({ id: project.id, data: { name, description } })).unwrap();
        toast.success('Project updated successfully');
        if (onClose) onClose();
      } else {
        // Create new project
        await dispatch(createProject({ name, description, clientId: 'currentClientId' })).unwrap();
        toast.success('Project created successfully');
        setName('');
        setDescription('');
      }
    } catch (error: any) {
      toast.error(error || 'Failed to submit form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Project Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter project name"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter project description"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {project ? 'Update Project' : 'Create Project'}
        </button>
        {project && onClose && (
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

export default ProjectForm;
