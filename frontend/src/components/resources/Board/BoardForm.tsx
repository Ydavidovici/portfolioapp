// src/components/resources/Board/BoardForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBoard, editBoard, getBoards } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Board } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';
import './BoardForm.css'; // Optional: For styling

interface RouteParams {
    id?: string;
}

const BoardForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const { boards, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    const existingBoard = boards.find((b) => b.id === id);

    const [name, setName] = useState(existingBoard ? existingBoard.name : '');
    const [description, setDescription] = useState(existingBoard ? existingBoard.description || '' : '');
    const [status, setStatus] = useState<Board['status']>(existingBoard ? existingBoard.status : 'active');

    useEffect(() => {
        if (!existingBoard && id) {
            dispatch(getBoards());
        }
    }, [dispatch, existingBoard, id]);

    useEffect(() => {
        if (existingBoard) {
            setName(existingBoard.name);
            setDescription(existingBoard.description || '');
            setStatus(existingBoard.status);
        }
    }, [existingBoard]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id && existingBoard) {
            await dispatch(
                editBoard({
                    ...existingBoard,
                    name,
                    description,
                    status,
                    // Add any other fields as necessary
                })
            );
        } else {
            await dispatch(
                addBoard({
                    name,
                    description,
                    status,
                    // Add any other fields as necessary
                })
            );
        }
        history.push('/developer-dashboard/boards');
    };

    return (
        <div className="board-form">
            <h2>{id ? 'Edit Board' : 'Create Board'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description (optional):</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as Board['status'])}>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                {/* Add more form fields as necessary */}
                <div className="form-actions">
                    <button type="submit">{id ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => history.push('/developer-dashboard/boards')}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default BoardForm;
