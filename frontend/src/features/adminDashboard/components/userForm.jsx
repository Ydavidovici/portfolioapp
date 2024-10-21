// src/features/admin/commonComponents/UserForm.tsx
import React, { useEffect, useState } from 'react';
import { User, createUser, updateUser } from '@/store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchRoles } from '@/store/slices/roleSlice';
import { toast } from 'react-toastify';

interface UserFormProps {
  user?: User;
  onClose?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { roles, isLoading: rolesLoading } = useSelector((state: RootState) => state.roles);

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [role, setRole] = useState(user ? user.role : '');

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(fetchRoles());
    }
  }, [dispatch, roles.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (user) {
        // Update existing user
        await dispatch(updateUser({ id: user.id, data: { name, email, role } })).unwrap();
        toast.success('User updated successfully');
        if (onClose) onClose();
      } else {
        // Create new user
        await dispatch(createUser({ name, email, role })).unwrap();
        toast.success('User created successfully');
        setName('');
        setEmail('');
        setRole('');
      }
    } catch (error: any) {
      toast.error(error || 'Failed to submit form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter email"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={rolesLoading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {user ? 'Update User' : 'Create User'}
        </button>
        {user && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
