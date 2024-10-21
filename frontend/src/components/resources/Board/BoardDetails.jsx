// src/components/resources/Board/BoardDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBoards } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Board } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';
import './BoardDetails.css'; // Optional: For styling

interface RouteParams {
    id: string;
}

const BoardDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const dispatch = useDispatch<AppDispatch>();
    const { boards, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const board: Board | undefined = boards.find((b) => b.id === id);

    useEffect(() => {
        if (!board) {
            dispatch(getBoards());
        }
    }, [dispatch, board]);

    if (loading) return <p>Loading board details...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!board) return <p>Board not found.</p>;

    return (
        <div className="board-details">
            <h2>{board.name}</h2>
            <p><strong>Description:</strong> {board.description || 'No description provided.'}</p>
            <p><strong>Status:</strong> {board.status}</p>
            {/* Display other board details as necessary */}

            {/* Example: Display associated tasks or members */}
            <h3>Tasks</h3>
            {board.tasks.length === 0 ? (
                <p>No tasks assigned.</p>
            ) : (
                <ul>
                    {board.tasks.map((task) => (
                        <li key={task.id}>
                            <span>{task.title}</span> - {task.completed ? 'Completed' : 'Pending'}
                            {task.dueDate && <span> - Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                        </li>
                    ))}
                </ul>
            )}

            <div className="board-actions">
                {(userRole === 'admin' || userRole === 'developer') && (
                    <>
                        <Link to={`/developer-dashboard/boards/edit/${board.id}`}>
                            <button>Edit Board</button>
                        </Link>
                        {/* Add more admin/developer-specific actions if needed */}
                    </>
                )}
                <Link to="/developer-dashboard/boards">
                    <button>Back to Boards</button>
                </Link>
            </div>
        </div>
    );
};

export default BoardDetails;
