// src/features/dashboard/admin/components/UserTable.tsx
import React from 'react';
import { User } from '@/store/slices/userSlice';
import EditUserModal from './EditUserModal';
import { useDispatch } from 'react-redux';
import { deleteUser } from '@/store/slices/userSlice';
import { toast } from 'react-toastify';

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const dispatch = useDispatch();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => toast.success('User deleted successfully'))
        .catch((err: string) => toast.error(err));
    }
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
      <tr>
        <th className="py-2">ID</th>
        <th className="py-2">Name</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Actions</th>
      </tr>
      </thead>
      <tbody>
      {users.map((user) => (
        <tr key={user.id} className="text-center">
          <td className="border px-4 py-2">{user.id}</td>
          <td className="border px-4 py-2">{user.name}</td>
          <td className="border px-4 py-2">{user.email}</td>
          <td className="border px-4 py-2">{user.role}</td>
          <td className="border px-4 py-2">
            <EditUserModal user={user} />
            <button
              onClick={() => handleDelete(user.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default UserTable;
