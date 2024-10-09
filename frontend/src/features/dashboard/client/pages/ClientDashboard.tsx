// src/features/client/pages/ClientDashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '@/store/slices/projectSlice';
import { fetchTasks } from '@/store/slices/taskSlice';
import { RootState } from '@/store';
import ProjectList from '../components/ProjectList';
import TaskList from '../components/TaskList';

const ClientDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { projects, isLoading: projectsLoading, error: projectsError } = useSelector((state: RootState) => state.projects);
  const { tasks, isLoading: tasksLoading, error: tasksError } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Projects</h2>
        {projectsLoading ? (
          <p>Loading projects...</p>
        ) : projectsError ? (
          <p className="text-red-500">{projectsError}</p>
        ) : (
          <ProjectList projects={projects} />
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Tasks</h2>
        {tasksLoading ? (
          <p>Loading tasks...</p>
        ) : tasksError ? (
          <p className="text-red-500">{tasksError}</p>
        ) : (
          <TaskList tasks={tasks} />
        )}
      </section>
    </div>
  );
};

export default ClientDashboard;
