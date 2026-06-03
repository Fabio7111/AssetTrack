import React from 'react';

function TableBase({ columns, data, renderRow }) {
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thStyle = { backgroundColor: '#f4f4f9', padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} style={thStyle}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, index) => renderRow(item, index))
        ) : (
          <tr>
            <td colSpan={columns.length} style={{ padding: '15px', textAlign: 'center' }}>
              Nenhum registro encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TableBase;