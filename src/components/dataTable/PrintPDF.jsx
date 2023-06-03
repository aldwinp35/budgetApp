import React from 'react';
import PropTypes from 'prop-types';
import { TbPrinter } from 'react-icons/tb';
import ReactToPrint from 'react-to-print';
import Tooltip from '../Tooltip';
import PrintViewRef from './PrintView';

function triggerEl() {
  return (
    <div className="btn-circle" role="button" aria-expanded="false">
      <Tooltip text="Print">
        <span className="d-flex">
          <TbPrinter className="fs-5" />
        </span>
      </Tooltip>
    </div>
  );
}

function PrintPDF({ documentTitle, logoText, logoImageUrl }) {
  const componentRef = React.useRef();
  return (
    <>
      <ReactToPrint
        documentTitle={documentTitle || 'untitle'}
        trigger={() => triggerEl()}
        content={() => componentRef.current}
      />
      <div style={{ display: 'none' }}>
        <PrintViewRef
          ref={componentRef}
          documentTitle={documentTitle}
          logoText={logoText}
          logoImageUrl={logoImageUrl}
        />
      </div>
    </>
  );
}

PrintPDF.propTypes = {
  documentTitle: PropTypes.string,
  logoText: PropTypes.string,
  logoImageUrl: PropTypes.string,
};

PrintPDF.defaultProps = {
  documentTitle: null,
  logoText: null,
  logoImageUrl: null,
};

export default PrintPDF;
