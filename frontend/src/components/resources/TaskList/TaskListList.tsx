// src/features/developerDashboard/components/TaskList/TaskList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskLists, removeTaskList } from '../../developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { TaskList } from '../../types';
import { Link } from 'react-router-dom';
import './TaskList.css'; // Optional: For styling

const TaskListList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { taskLists, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    useEffect(() => {
        dispatch(getTaskLists());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this task list?')) {
            dispatch(removeTaskList(id));
        }
    };

    if (loading) return <p>Loading task lists...</p>;
    if (error) return <p>Error: {error}</p>;
    if (taskLists.length === 0) return <p>No task lists found.</p>;

    return (
        <div className="tasklist-list">
            <h2>Task Lists</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/task-lists/create">
                    <button>Add New Task List</button>
                </Link>
            )}
            <ul>
                {taskLists.map((taskList: TaskList) => (
                    <li key={taskList.id} className="tasklist-item">
                        <h3>{taskList.name}</h3>
                        <p>Project ID: {taskList.projectId}</p>
                        <div className="tasklist-actions">
                            <Link to={`/developer-dashboard/task-lists/${taskList.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/task-lists/edit/${taskList.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(taskList.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskListList;
