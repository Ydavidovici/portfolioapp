// src/features/admin/commonComponents/RoleForm.tsx
import React, { useState } from 'react';
import { Role } from '@/store/slices/roleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createRole, updateRole } from '@/store/slices/roleSlice';
import { RootState } from '@/store';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

interface RoleFormProps {
  existingRole?: Role;
}

const RoleForm: React.FC<RoleFormProps> = ({ existingRole }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState(existingRole?.name || '');
  const [permissions, setPermissions] = useState<string[]>(existingRole?.permissions || []);

  const handlePermissionChange = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
    );
  };

  const availablePermissions = [
    'create_user',
    'delete_user',
    'update_user',
    'view_user',
    'create_role',
    'delete_role',
    'update_role',
    'view_role',
    // Add other permissions as needed
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || permissions.length === 0) {
      toast.error('Please provide a role name and select at least one permission');
      return;
    }

    try {
      if (existingRole) {
        await dispatch(updateRole({ id: existingRole.id, data: { name, permissions } })).unwrap();
        toast.success('Role updated successfully!');
      } else {
        await dispatch(createRole({ name, permissions })).unwrap();
        toast.success('Role created successfully!');
      }
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Role Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter role name"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Permissions</label>
        <div className="flex flex-wrap">
          {availablePermissions.map((permission) => (
            <label key={permission} className="mr-4 mb-2">
              <input
                type="checkbox"
                checked={permissions.includes(permission)}
                onChange={() => handlePermissionChange(permission)}
                className="mr-2"
              />
              {permission.replace('_', ' ').toUpperCase()}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {existingRole ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
