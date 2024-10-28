// src/features/adminDashboard/components/UserList.jsx

import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
// import './UserList.css';

const UserList = ({ users, onDelete, onEdit }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch roles from API
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles');
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(id);
    }
  };

  return (
    <div>
      <UserForm onSubmit={onEdit} roles={roles} />
      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <UserForm
              user={editingUser}
              onSubmit={async (updatedUser) => {
                try {
                  await onEdit(updatedUser);
                  setEditingUser(null);
                } catch (error) {
                  console.error('Error updating user:', error);
                }
              }}
              roles={roles}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
