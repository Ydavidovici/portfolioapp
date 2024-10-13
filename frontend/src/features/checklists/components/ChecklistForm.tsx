// src/features/checklists/commonComponents/ChecklistForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createChecklist } from '../checklistsSlice';

const ChecklistForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createChecklist({ title }));
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Checklist Title"
        required
      />
      <button type="submit">Create Checklist</button>
    </form>
  );
};

export default ChecklistForm;
