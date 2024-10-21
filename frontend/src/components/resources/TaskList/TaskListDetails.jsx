// src/features/developerDashboard/components/TaskList/TaskListDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { getTaskLists } from '../../developerDashboardSlice';
import { TaskList } from '../../types';
import { useParams, Link } from 'react-router-dom';
import './TaskListDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const TaskListDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { taskLists, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const taskList: TaskList | undefined = taskLists.find((tl) => tl.id === id);

    useEffect(() => {
        if (!taskList) {
            dispatch(getTaskLists());
        }
    }, [dispatch, taskList]);

    if (loading) return <p>Loading task list details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!taskList) return <p>Task List not found.</p>;

    return (
        <div className="tasklist-details">
            <h2>{taskList.name}</h2>
            <p>Project ID: {taskList.projectId}</p>
            {/* Display associated tasks if any */}
            <h3>Tasks</h3>
            {/* Assuming tasks are fetched and available */}
            {/* You can enhance this section to display related tasks */}
            {(userRole === 'admin' || userRole === 'developer') && (
                <div className="tasklist-actions">
                    <Link to={`/developer-dashboard/task-lists/edit/${taskList.id}`}>
                        <button>Edit Task List</button>
                    </Link>
                    {/* Add more admin/developer-specific actions if needed */}
                </div>
            )}
            <Link to="/developer-dashboard/task-lists">
                <button>Back to Task Lists</button>
            </Link>
        </div>
    );
};

export default TaskListDetails;
