// src/features/checklistItems/components/ChecklistItemsForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createChecklistItem } from '../checklistItemsSlice';

const ChecklistItemsForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createChecklistItem({ title, completed: false }));
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Checklist Item Title"
        required
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default ChecklistItemsForm;
