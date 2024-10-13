// src/features/adminDashboard/pages/AdminDashboard.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import Footer from '../../../commonComponents/Footer';
import { getUsers } from '../userSlice';
import { getRoles } from '../roleSlice';
import { RootState } from '../../../store/store';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const roles = useSelector((state: RootState) => state.roles.roles);
  const usersLoading = useSelector((state: RootState) => state.users.loading);
  const rolesLoading = useSelector((state: RootState) => state.roles.loading);
  const usersError = useSelector((state: RootState) => state.users.error);
  const rolesError = useSelector((state: RootState) => state.roles.error);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getRoles());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-8 bg-gray-100">
            <section className="mb-12">
              <h1 className="text-3xl font-semibold mb-6">Users</h1>
              {usersLoading ? (
                <div className="flex justify-center items-center py-10">
                  <LoadingSpinner size="lg" color="text-blue-500" />
                </div>
              ) : usersError ? (
                <div className="text-red-500 text-center py-10">{usersError}</div>
              ) : (
                <DataTable data={users} type="user" />
              )}
            </section>

            <section>
              <h1 className="text-3xl font-semibold mb-6">Roles</h1>
              {rolesLoading ? (
                <div className="flex justify-center items-center py-10">
                  <LoadingSpinner size="lg" color="text-blue-500" />
                </div>
              ) : rolesError ? (
                <div className="text-red-500 text-center py-10">{rolesError}</div>
              ) : (
                <DataTable data={roles} type="role" />
              )}
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
