// src/features/checklistItems/components/ChecklistItemsList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChecklistItems } from '../checklistItemsSlice';
import { RootState } from '../../store/types';

const ChecklistItemsList: React.FC = () => {
  const dispatch = useDispatch();
  const { checklistItems, loading, error } = useSelector((state: RootState) => state.checklistItems);

  useEffect(() => {
    dispatch(fetchChecklistItems());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {checklistItems.map((item) => (
        <li key={item.id}>
          {item.title} - {item.completed ? 'Completed' : 'Pending'}
        </li>
      ))}
    </ul>
  );
};

export default ChecklistItemsList;
