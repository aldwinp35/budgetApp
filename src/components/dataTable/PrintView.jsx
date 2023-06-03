import React from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import { toTitleCase } from './helpers';

function Headers() {
  const { keys } = React.useContext(Context);
  // Make sure keys are set
  if (!keys) {
    return null;
  }

  return keys.map((key, index) => (
    <th className="fw-semibold" key={index}>
      {toTitleCase(key)}
    </th>
  ));
}

function Rows() {
  const { keys, data, firstPageIndex, lastPageIndex } =
    React.useContext(Context);

  // Make sure keys are set
  // No need to check for data,
  //  already checked in DataTable component
  if (!keys) {
    return null;
  }

  return data.slice(firstPageIndex, lastPageIndex).map((item, index) => (
    <tr key={index}>
      {keys.map((key, i) => (
        <td key={i}>{item[key]}</td>
      ))}
    </tr>
  ));
}

function PrintView(props, ref) {
  const { keys } = React.useContext(Context);
  const { documentTitle, logoText, logoImageUrl } = props;
  if (!keys) {
    return null;
  }

  return (
    <div ref={ref} className="p-3">
      {/* Company logo & document title */}
      <div style={{ marginBottom: '50px', marginTop: '20px' }}>
        {logoText ? (
          <div className="fs-5 fw-semibold text-center text-secondary">
            {logoText}
          </div>
        ) : null}

        {logoImageUrl ? (
          <img
            style={{ maxWidth: '90px', maxHeight: '90px' }}
            src={logoImageUrl}
            alt="logo"
          />
        ) : null}
      </div>

      {documentTitle ? (
        <div className="fs-6 fw-semibold mb-3">{documentTitle}</div>
      ) : null}

      {/* Render data */}
      <table className="table table-bordered">
        <thead>
          <tr>
            {/* Render each key as header (th) */}
            <Headers />
          </tr>
        </thead>
        <tbody>
          {/* Render each data object as row (tr) */}
          <Rows />
        </tbody>
      </table>
    </div>
  );
}

const PrintViewRef = React.forwardRef(PrintView);

PrintView.propTypes = {
  documentTitle: PropTypes.string,
  logoText: PropTypes.string,
  logoImageUrl: PropTypes.string,
};

PrintView.defaultProps = {
  documentTitle: null,
  logoText: null,
  logoImageUrl: null,
};

export default PrintViewRef;
