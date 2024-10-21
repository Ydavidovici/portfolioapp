// src/features/adminDashboard/commonComponents/RoleModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Role } from '../types.ts';
import { useDispatch } from 'react-redux';
import { addRole, editRole } from '../userSlice';
import Button from '../../common/Button';
import FormField from '../../common/FormField';

interface RoleModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  existingRole?: Role;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onRequestClose, existingRole }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(existingRole ? existingRole.name : '');

  useEffect(() => {
    if (existingRole) {
      setName(existingRole.name);
    } else {
      setName('');
    }
  }, [existingRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingRole) {
      dispatch(editRole({ ...existingRole, name }));
    } else {
      dispatch(addRole({ name }));
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={existingRole ? "Edit Role" : "Create Role"}
      className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-semibold mb-4">{existingRole ? "Edit Role" : "Create New Role"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Role Name"
          type="text"
          placeholder="Enter role name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <Button variant="secondary" type="button" onClick={onRequestClose}>Cancel</Button>
          <Button variant="primary" type="submit">{existingRole ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default RoleModal;
