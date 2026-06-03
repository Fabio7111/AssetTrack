import React from 'react';

function Input({ label, type = 'text', value, onChange, placeholder, name }) {
  const containerStyle = { display: 'flex', flexDirection: 'column', marginBottom: '15px' };
  const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' };

  return (
    <div style={containerStyle}>
      {label && <label style={{ marginBottom: '5px', fontWeight: '500' }}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

export default Input;