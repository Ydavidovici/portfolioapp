// src/features/adminDashboard/commonComponents/ConfirmationPrompt.tsx

import React from 'react';
import Button from './Button.jsx';

interface ConfirmationPromptProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="mt-4 flex justify-center items-center gap-4">
      <span>{message}</span>
      <Button variant="danger" onClick={onConfirm}>Yes</Button>
      <Button variant="secondary" onClick={onCancel}>No</Button>
    </div>
  );
};

export default ConfirmationPrompt;
