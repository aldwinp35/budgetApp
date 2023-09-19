import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { TbPrinter } from 'react-icons/tb';
import ReactToPrint from 'react-to-print';

import PrintView from './PrintView';
import ButtonCircle from '../util/ButtonCircle';

PrintPDF.propTypes = {
  title: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  filename: PropTypes.string.isRequired,
};

PrintPDF.defaultProps = {
  title: null,
  header: null,
};

function PrintPDF({ title, filename, header }) {
  const ref = useRef();
  return (
    <>
      <ReactToPrint
        documentTitle={filename}
        trigger={() => TriggerEl()}
        content={() => ref.current}
      />
      <div style={{ display: 'none' }}>
        <PrintView title={title} header={header} ref={ref} />
      </div>
    </>
  );
}

const TriggerEl = () => {
  return (
    <ButtonCircle>
      <TbPrinter className="fs-5" />
    </ButtonCircle>
  );
};

export default PrintPDF;
