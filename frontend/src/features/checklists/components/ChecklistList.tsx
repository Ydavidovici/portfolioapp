// src/features/checklists/commonComponents/ChecklistList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChecklists } from '../checklistsSlice';
import { RootState } from '../../store/types';

const ChecklistList: React.FC = () => {
  const dispatch = useDispatch();
  const { checklists, loading, error } = useSelector((state: RootState) => state.checklists);

  useEffect(() => {
    dispatch(fetchChecklists());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {checklists.map((checklist) => (
        <li key={checklist.id}>{checklist.title}</li>
      ))}
    </ul>
  );
};

export default ChecklistList;
