// src/components/common/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken'); // Clear persisted token
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const renderLinks = () => {
    if (auth.token && auth.user) {
      switch (auth.user.role) {
        case 'admin':
          return (
            <>
              <Link to="/admin/dashboard" className="text-white mr-4">
                Admin Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                Logout
              </button>
            </>
          );
        case 'client':
          return (
            <>
              <Link to="/client/dashboard" className="text-white mr-4">
                Client Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                Logout
              </button>
            </>
          );
        case 'developer':
          return (
            <>
              <Link to="/developer/dashboard" className="text-white mr-4">
                Developer Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                Logout
              </button>
            </>
          );
        default:
          return (
            <>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                Logout
              </button>
            </>
          );
      }
    } else {
      return (
        <>
          <Link to="/login" className="text-white mr-4">
            Login
          </Link>
          <Link to="/register" className="text-white">
            Register
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-lg">
          Davidovici Software
        </Link>
        <div>{renderLinks()}</div>
      </div>
    </nav>
  );
};

export default Navbar;
