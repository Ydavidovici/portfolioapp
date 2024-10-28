// src/components/resources/Board/BoardList.jsx

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './BoardList.css'; // Optional: For styling

const BoardList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: boards, loading, error } = useFetch('/api/boards');

  // Local state to manage boards after deletion
  const [boardList, setBoardList] = useState(boards || []);

  // Update boardList when boards data changes
  React.useEffect(() => {
    if (boards) {
      setBoardList(boards);
    }
  }, [boards]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        const response = await fetch(`/api/boards/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete board');
        }
        // Remove the deleted board from local state to update UI
        setBoardList((prevBoards) =>
          prevBoards.filter((board) => board.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading boards...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!boardList || boardList.length === 0) return <p>No boards found.</p>;

  return (
    <div className="board-list">
      <h2>Boards</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/boards/create">
          <button className="create-button">Add New Board</button>
        </Link>
      )}
      <ul>
        {boardList.map((board) => (
          <li key={board.id} className="board-item">
            <h3>{board.name}</h3>
            <p>{board.description}</p>
            <p>Status: {board.status}</p>
            {/* Display other board details as necessary */}
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

BoardList.propTypes = {
  // No props are passed directly to this component
};

export default BoardList;
