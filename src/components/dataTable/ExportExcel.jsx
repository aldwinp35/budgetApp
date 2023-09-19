import React, { useContext } from 'react';
import XLSX from 'sheetjs-style-v2';
import PropTypes from 'prop-types';
import { TbTableExport } from 'react-icons/tb';
import ButtonCircle from '../util/ButtonCircle';
import Context from '../../context/Context';

ExportExcel.propTypes = {
  filename: PropTypes.string.isRequired,
};

function ExportExcel({ filename }) {
  const { data, keys } = useContext(Context);

  return (
    <ButtonCircle onClick={() => exportToExcel(data, keys, filename)}>
      <TbTableExport className="fs-5" />
    </ButtonCircle>
  );
}

const exportToExcel = async (data, keys, filename) => {
  const fileExtension = '.xlsx';
  const excelData = getExportData(data, keys);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  XLSX.writeFile(wb, filename + fileExtension);
};

const getExportData = (data, keys) => {
  return data.map((item) => {
    const obj = {};
    keys.forEach((key) => {
      obj[key] = item[key];
    });
    return obj;
  });
};
export default ExportExcel;
