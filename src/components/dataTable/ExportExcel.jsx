import React from 'react';
import XLSX from 'sheetjs-style-v2';
import PropTypes from 'prop-types';
import { TbTableExport } from 'react-icons/tb';
import Tooltip from '../Tooltip';

function ExportExcel({ excelData, fileName }) {
  const fileExtension = '.xlsx';

  async function exportToExcel() {
    let data = excelData;
    const wb = XLSX.utils.book_new();
    if (typeof excelData === 'function') {
      data = await excelData();
    }
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, fileName + fileExtension);
  }

  return (
    <div
      className="btn-circle"
      role="button"
      aria-expanded="false"
      onClick={() => exportToExcel()}
    >
      <Tooltip text="Export Excel">
        <span className="d-flex">
          <TbTableExport className="fs-5" />
        </span>
      </Tooltip>
    </div>
  );
}

ExportExcel.propTypes = {
  fileName: PropTypes.string.isRequired,
  excelData: PropTypes.oneOfType([PropTypes.arrayOf(Object), PropTypes.func]),
};

ExportExcel.defaultProps = {
  excelData: null,
};

export default ExportExcel;
