// src/features/auth/hooks/useAuth.ts

import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../authSlice';
import { RootState, AppDispatch } from '../../../store/store';

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const logoutUser = () => {
    dispatch(logout());
  };

  return { ...auth, logoutUser };
};
