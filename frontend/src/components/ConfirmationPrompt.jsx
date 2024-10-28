// src/components/common/ConfirmationPrompt.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button.jsx'; // Ensure the path is correct based on your project structure

const ConfirmationPrompt = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="mt-4 flex justify-center items-center gap-4">
      <span>{message}</span>
      <Button variant="danger" onClick={onConfirm}>
        Yes
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        No
      </Button>
    </div>
  );
};

ConfirmationPrompt.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationPrompt;
