import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Context from '../../context/Context';

// eslint-disable-next-line react/prop-types
function PrintView({ title, header }, ref) {
  const { data, keys, columnNames: columns } = useContext(Context);

  return (
    <div ref={ref} className="p-3">
      {/* Document header */}
      <div style={{ marginBottom: '50px', marginTop: '20px' }}>
        {header ? <div>{header}</div> : null}
      </div>

      {/* Document title */}
      {title ? <div>{title}</div> : null}

      {/* Render data */}
      <table className="table table-sm table-bordered">
        <thead>
          <tr>
            <Headers columns={columns} />
          </tr>
        </thead>
        <tbody>
          <Rows keys={keys} data={data} />
        </tbody>
      </table>
    </div>
  );
}

const PrintViewRef = React.forwardRef(PrintView);
export default PrintViewRef;

Headers.propTypes = {
  columns: PropTypes.arrayOf(String).isRequired,
};

function Headers({ columns }) {
  return columns.map((col, index) => (
    <td className="fw-semibold" key={index}>
      {col}
    </td>
  ));
}

Rows.propTypes = {
  data: PropTypes.arrayOf(Object).isRequired,
  keys: PropTypes.arrayOf(String).isRequired,
};

function Rows({ keys, data }) {
  return data.map((item, index) => (
    <tr key={index}>
      {keys.map((key, i) => (
        <td key={i}>{item[key]}</td>
      ))}
    </tr>
  ));
}
