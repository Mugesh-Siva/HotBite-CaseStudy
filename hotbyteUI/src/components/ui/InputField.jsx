import React from 'react';
import './InputField.css';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required = false, error, className = '' }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={name} className="input-label">{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-control ${error ? 'input-error' : ''}`}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default InputField;
