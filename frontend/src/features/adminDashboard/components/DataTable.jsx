import React, { useState } from 'react';
import Button from '../../../Components/Button';
import UserModal from './UserModal';
import RoleModal from './RoleModal';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import ConfirmationPrompt from '../../../Components/ConfirmationPrompt';
// import './DataTable.css'; // Optional: For styling

const DataTable = ({ data, type, onEdit, onDelete, loading, error }) => {
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleEdit = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      onDelete(pendingDeleteId);
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
              <th className="py-2 px-4 border-b">
                {type === 'user' ? 'Role' : 'Role Name'}
              </th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="py-2 px-4 border-b">{item.id}</td>
                {type === 'user' && item.name && (
                  <td className="py-2 px-4 border-b">{item.name}</td>
                )}
                {type === 'user' && item.email && (
                  <td className="py-2 px-4 border-b">{item.email}</td>
                )}
                <td className="py-2 px-4 border-b">
                  {type === 'user' ? item.role : item.name}
                </td>
                <td className="py-2 px-4 border-b flex justify-center gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
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
      {type === 'user' && editItem && (
        <UserModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          existingUser={editItem}
          onEdit={onEdit}
        />
      )}
      {type === 'role' && editItem && (
        <RoleModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          existingRole={editItem}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};

export default DataTable;
