// src/features/auth/hooks/useAuth.js

import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const logoutUser = () => {
    dispatch(logout());
  };

  return { ...auth, logoutUser };
};
