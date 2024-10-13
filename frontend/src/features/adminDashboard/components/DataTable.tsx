// src/features/adminDashboard/components/DataTable.tsx

import React, { useState } from 'react';
import { User, Role } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../userSlice';
import { removeRole } from '../roleSlice';
import Button from '../../common/Button';
import UserModal from './UserModal';
import RoleModal from './RoleModal';
import LoadingSpinner from '../../common/LoadingSpinner';
import ConfirmationPrompt from '../../common/ConfirmationPrompt';

interface DataTableProps<T> {
  data: T[];
  type: 'user' | 'role';
}

const DataTable = <T extends { id: number }>({ data, type }: DataTableProps<T>) => {
  const dispatch = useDispatch();
  const [editItem, setEditItem] = useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const loading = useSelector((state: any) => {
    return type === 'user' ? state.users.loading : state.roles.loading;
  });

  const error = useSelector((state: any) => {
    return type === 'user' ? state.users.error : state.roles.error;
  });

  const handleEdit = (item: T) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      if (type === 'user') {
        dispatch(removeUser(pendingDeleteId));
      } else if (type === 'role') {
        dispatch(removeRole(pendingDeleteId));
      }
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const closeModal = () => {
    setEditItem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="lg" color="text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            {type === 'user' && <th className="py-2 px-4 border-b">Name</th>}
            {type === 'user' && <th className="py-2 px-4 border-b">Email</th>}
            <th className="py-2 px-4 border-b">{type === 'user' ? 'Role' : 'Role Name'}</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
          </thead>
          <tbody>
          {data.map((item: T) => (
            <tr key={item.id} className="text-center">
              <td className="py-2 px-4 border-b">{item.id}</td>
              {type === 'user' && 'name' in item && <td className="py-2 px-4 border-b">{(item as User).name}</td>}
              {type === 'user' && 'email' in item && <td className="py-2 px-4 border-b">{(item as User).email}</td>}
              <td className="py-2 px-4 border-b">{type === 'user' ? (item as User).role : (item as Role).name}</td>
              <td className="py-2 px-4 border-b flex justify-center gap-2">
                <Button variant="secondary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Prompt */}
      {pendingDeleteId !== null && (
        <ConfirmationPrompt
          message="Are you sure you want to delete this item?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Conditionally render UserModal or RoleModal */}
      {type === 'user' && editItem && 'name' in editItem && (
        <UserModal isOpen={isModalOpen} onRequestClose={closeModal} existingUser={editItem as User} />
      )}
      {type === 'role' && editItem && 'name' in editItem && (
        <RoleModal isOpen={isModalOpen} onRequestClose={closeModal} existingRole={editItem as Role} />
      )}
    </div>
  );
};

export default DataTable;
