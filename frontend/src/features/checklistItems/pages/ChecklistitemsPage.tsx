// src/features/checklistItems/pages/ChecklistsPage.tsx
import React from 'react';
import ChecklistItemsList from '../components/ChecklistItemsList';
import ChecklistItemsForm from '../components/ChecklistItemsForm';

const ChecklistItemsPage: React.FC = () => {
  return (
    <div>
      <h1>Checklist Items</h1>
      <ChecklistItemsForm />
      <ChecklistItemsList />
    </div>
  );
};

export default ChecklistItemsPage;
