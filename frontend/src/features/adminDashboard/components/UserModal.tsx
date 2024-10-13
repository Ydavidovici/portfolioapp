// src/features/adminDashboard/commonComponents/UserModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { User } from '../types';
import { useDispatch } from 'react-redux';
import { addUser, editUser } from '../userSlice';
import Button from '../../common/Button';
import FormField from '../../common/FormField';

interface UserModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  existingUser?: User;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onRequestClose, existingUser }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(existingUser ? existingUser.name : '');
  const [email, setEmail] = useState(existingUser ? existingUser.email : '');
  const [role, setRole] = useState(existingUser ? existingUser.role : '');

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name);
      setEmail(existingUser.email);
      setRole(existingUser.role);
    } else {
      setName('');
      setEmail('');
      setRole('');
    }
  }, [existingUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingUser) {
      dispatch(editUser({ ...existingUser, name, email, role }));
    } else {
      dispatch(addUser({ name, email, role }));
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={existingUser ? "Edit User" : "Create User"}
      className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-semibold mb-4">{existingUser ? "Edit User" : "Create New User"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Name"
          type="text"
          placeholder="Enter name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-black text-base font-normal font-sans">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-8 py-4 bg-white rounded-14px border border-black focus:ring-2 focus:ring-primary"
            required
          >
            <option value="" disabled>Select role</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
            {/* Populate dynamically if roles are fetched */}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" type="button" onClick={onRequestClose}>Cancel</Button>
          <Button variant="primary" type="submit">{existingUser ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
