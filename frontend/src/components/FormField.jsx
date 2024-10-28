// src/commonComponents/FormField.jsx
import React from 'react';

const FormField = ({
  label,
  type = 'text',
  placeholder = '',
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-black text-base font-normal font-sans">
        {label}
      </label>
      {type !== 'textarea' ? (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full px-8 py-4 bg-white rounded-14px border border-black focus:ring-2 focus:ring-primary"
        />
      ) : (
        <textarea
          placeholder={placeholder}
          required={required}
          className="w-full px-8 py-4 bg-white rounded-14px border border-black focus:ring-2 focus:ring-primary"
          rows="5"
        ></textarea>
      )}
    </div>
  );
};

export default FormField;
