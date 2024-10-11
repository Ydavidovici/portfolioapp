// src/features/admin/pages/AdminDashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/store/slices/userSlice';
import { fetchRoles } from '@/store/slices/roleSlice';
import { RootState } from '@/store';
import UserList from '../components/UserList';
import RoleList from '../components/RoleList';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { users, isLoading: usersLoading, error: usersError } = useSelector((state: RootState) => state.users);
  const { roles, isLoading: rolesLoading, error: rolesError } = useSelector((state: RootState) => state.roles);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Users</h2>
        {usersLoading ? (
          <p>Loading users...</p>
        ) : usersError ? (
          <p className="text-red-500">{usersError}</p>
        ) : (
          <UserList users={users} />
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Roles</h2>
        {rolesLoading ? (
          <p>Loading roles...</p>
        ) : rolesError ? (
          <p className="text-red-500">{rolesError}</p>
        ) : (
          <RoleList roles={roles} />
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
