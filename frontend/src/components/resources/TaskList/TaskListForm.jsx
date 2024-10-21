// src/features/developerDashboard/components/TaskList/TaskListForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskList, editTaskList, getTaskLists } from '../../developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store';
import { TaskList } from '../../types';
import { useHistory, useParams } from 'react-router-dom';
import './TaskListForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const TaskListForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { taskLists, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingTaskList = taskLists.find((tl) => tl.id === id);

    const [name, setName] = useState(existingTaskList ? existingTaskList.name : '');
    const [projectId, setProjectId] = useState(existingTaskList ? existingTaskList.projectId : '');

    useEffect(() => {
        if (!existingTaskList && id) {
            dispatch(getTaskLists());
        }
    }, [dispatch, existingTaskList, id]);

    useEffect(() => {
        if (existingTaskList) {
            setName(existingTaskList.name);
            setProjectId(existingTaskList.projectId);
        }
    }, [existingTaskList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingTaskList) {
            await dispatch(
                editTaskList({
                    ...existingTaskList,
                    name,
                    projectId,
                })
            );
        } else {
            await dispatch(
                addTaskList({
                    name,
                    projectId,
                })
            );
        }
        history.push('/developer-dashboard/task-lists');
    };

    return (
        <div className="tasklist-form">
            <h2>{id ? 'Edit Task List' : 'Create Task List'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Project ID:</label>
                    <input
                        type="text"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/task-lists')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default TaskListForm;
