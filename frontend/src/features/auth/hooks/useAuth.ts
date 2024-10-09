// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (data: LoginData) => {
    dispatch(loginStart());
    try {
      const response = await apiClient.post('/login', data);
      dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('authToken', response.data.token);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  const register = async (data: RegisterData) => {
    dispatch(loginStart()); // Using the same loading state
    try {
      const response = await apiClient.post('/register', data);
      dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('authToken', response.data.token);
      toast.success('Registered successfully!');
      navigate('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  const performLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  return {
    auth,
    login,
    register,
    logout: performLogout,
  };
};

export default useAuth;
