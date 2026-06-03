import React from 'react';

function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: variant === 'primary' ? '#0056b3' : '#e0e0e0',
    color: variant === 'primary' ? '#ffffff' : '#333333',
  };

  return (
    <button type={type} onClick={onClick} style={baseStyle} className={className}>
      {children}
    </button>
  );
}

export default Button;