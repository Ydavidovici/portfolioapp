// src/components/resources/Board/BoardDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './BoardDetails.css'; // Optional: For styling

const BoardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch board details
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch(`/api/boards/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch board details');
        }
        const data = await response.json();
        setBoard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        const response = await fetch(`/api/boards/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete board');
        }
        // Redirect to boards list after deletion
        navigate('/developer-dashboard/boards');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading board details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!board) return <p>Board not found.</p>;

  const { name, description, status, tasks } = board;
  const userRole = user?.role;

  return (
    <div className="board-details">
      <h2>{name}</h2>
      <p>
        <strong>Description:</strong>{' '}
        {description || 'No description provided.'}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      {/* Display other board details as necessary */}

      {/* Example: Display associated tasks */}
      <h3>Tasks</h3>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <span>{task.title}</span> -{' '}
              {task.completed ? 'Completed' : 'Pending'}
              {task.dueDate && (
                <span>
                  {' '}
                  - Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks assigned.</p>
      )}

      <div className="board-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/boards/edit/${board.id}`}>
              <button>Edit Board</button>
            </Link>
            <button onClick={handleDelete}>Delete Board</button>
          </>
        )}
        <Link to="/developer-dashboard/boards">
          <button>Back to Boards</button>
        </Link>
      </div>
    </div>
  );
};

BoardDetails.propTypes = {
  // No props are passed directly to this component
};

export default BoardDetails;
