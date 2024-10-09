// src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!auth.token;
  const userRole = auth.user?.role || '';

  return { isAuthenticated, userRole, user: auth.user };
};

export default useAuth;
