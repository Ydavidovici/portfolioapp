// src/components/resources/Board/BoardList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBoards, removeBoard } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Board } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';
import './BoardList.css'; // Optional: For styling

const BoardList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { boards, loading, error } = useSelector((state: RootState) => state.developerDashboard);
    const userRole = useSelector((state: RootState) => state.auth.user?.role); // Assuming auth slice exists

    useEffect(() => {
        dispatch(getBoards());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this board?')) {
            dispatch(removeBoard(id));
        }
    };

    if (loading) return <p>Loading boards...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (boards.length === 0) return <p>No boards found.</p>;

    return (
        <div className="board-list">
            <h2>Boards</h2>
            {(userRole === 'admin' || userRole === 'developer') && (
                <Link to="/developer-dashboard/boards/create">
                    <button className="create-button">Add New Board</button>
                </Link>
            )}
            <ul>
                {boards.map((board: Board) => (
                    <li key={board.id} className="board-item">
                        <h3>{board.name}</h3>
                        <p>{board.description}</p>
                        <p>Status: {board.status}</p>
                        <div className="board-actions">
                            <Link to={`/developer-dashboard/boards/${board.id}`}>
                                <button>View Details</button>
                            </Link>
                            {(userRole === 'admin' || userRole === 'developer') && (
                                <>
                                    <Link to={`/developer-dashboard/boards/edit/${board.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(board.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BoardList;
