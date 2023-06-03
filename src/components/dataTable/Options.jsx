import React from 'react';
import { BiSearch } from 'react-icons/bi';
import Tooltip from '../Tooltip';
import ExportExcel from './ExportExcel';
import PrintPDF from './PrintPDF';
import Context from './Context';

function Options() {
  const [toggleSearch, setToggleSearch] = React.useState(false);
  const { data, keys, title, filter, setFilter, setCurrentPage } =
    React.useContext(Context);

  function toggleSearchHandler() {
    setToggleSearch(!toggleSearch);
    setFilter('');
  }

  function getExportData() {
    return data.map((item) => {
      const obj = {};
      keys.forEach((key) => {
        obj[key] = item[key];
      });
      return obj;
    });
  }

  return (
    <div className="d-flex flex-column flex-md-row mb-3">
      <div className="d-flex justify-content-between mb-md-0 py-1 w-100">
        <div className="d-flex align-items-center">
          <h5>{title}</h5>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <PrintPDF documentTitle={title} logoText="Budget App" />
          <ExportExcel
            excelData={getExportData}
            fileName={title || 'untitle'}
          />
          {/* <div className="btn-circle" role="button" aria-expanded="false">
            <Tooltip text="Print">
              <span className="d-flex">
                <TbPrinter className="fs-5" />
              </span>
            </Tooltip>
          </div> */}
          {/* <div className="btn-circle" role="button" aria-expanded="false">
            <Tooltip text="Export">
              <span className="d-flex">
                <TbTableExport className="fs-5" />
              </span>
            </Tooltip>
          </div> */}
          <div
            className="btn-circle"
            role="button"
            aria-expanded="false"
            onClick={toggleSearchHandler}
          >
            <Tooltip text="Toggle">
              <span className="d-flex">
                <BiSearch className="fs-4" />
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
      {toggleSearch ? (
        <div className="div-input-search d-flex align-items-center mt-2 mt-md-0 ms-md-2">
          <input
            id="input-search"
            value={filter}
            autoFocus
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            type="text"
            className=""
            placeholder={`Search by ${
              keys
                ? `${keys.slice(0, 2).join(', ').replaceAll('_', ' ')}...`
                : 'fields'
            }`}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Options;
