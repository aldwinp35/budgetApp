import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { IoArrowDown } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';

import ButtonCircle from '../util/ButtonCircle';
import PrintPDF from './PrintPDF';
import ExportExcel from './ExportExcel';
import FilterComponent from './FilterComponent';
import Tooltip from '../util/Tooltip';
import Context from '../../context/Context';

import './filter-component.css';
import './styles.scss';

DataTableBase.propTypes = {
  // Datatable props
  data: PropTypes.arrayOf(Object).isRequired,
  columns: PropTypes.arrayOf(Object).isRequired,
  selectableRows: PropTypes.bool,

  // Custom props
  customTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  filterable: PropTypes.bool,
  exportable: PropTypes.bool,
  printable: PropTypes.bool,
  printHeader: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  printTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

DataTableBase.defaultProps = {
  selectableRows: null,
  customTitle: null,
  filterable: false,
  exportable: false,
  printable: false,
  printHeader: null,
  printTitle: null,
};

function DataTableBase(props) {
  const {
    data,
    columns,
    selectableRows,
    customTitle,
    filterable,
    exportable,
    printable,
    printHeader,
    printTitle,
  } = props;

  const [state, setState] = useState({
    filterText: '',
    toggleSearch: false,
    resetPaginationToggle: false,
  });

  const filteredData = useMemo(() => {
    const keys = getFilterableKeys(columns);
    const text = state.filterText.toLowerCase();

    return data.filter((item) =>
      keys.some((key) => item[key].toString().toLowerCase().includes(text))
    );
  }, [state.filterText, data]);

  const customStyles = useMemo(() => {
    return {
      headRow: {
        style: {
          fontSize: '14px',
        },
      },
      header: {
        style: {
          // padding: '0',
          fontSize: '20px',
          // backgroundColor: 'red',
        },
      },
      subHeader: {
        style: {
          // padding: '0',
          fontSize: '20px',
          // backgroundColor: 'red',
        },
      },
      // Remove border top from pagination
      pagination: {
        style: {
          borderTop: 'none',
        },
      },
    };
  });

  const value = useMemo(() => ({
    state,
    columns,
    data,
    keys: getKeys(columns),
    columnNames: getColumnNames(columns),
  }));

  return (
    <Context.Provider value={value}>
      {filterable || exportable || printable || customTitle ? (
        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-1">
          <div
            className="mb-3 mb-md-0 | ms-0 ms-md-3"
            style={{ fontSize: '20px' }}
          >
            {customTitle}
          </div>
          {data && data.length > 0 && (
            <div className="d-flex flex-column flex-md-row align-items-md-center">
              <div className="d-flex justify-content-center">
                {printable && (
                  <Tooltip text="Print (.pdf)" placement="bottom">
                    <PrintPDF
                      title={printTitle}
                      header={printHeader}
                      filename="no_name"
                    />
                  </Tooltip>
                )}

                {exportable && (
                  <Tooltip text="Export (.xlsx)" placement="bottom">
                    <ExportExcel filename="no_name" />
                  </Tooltip>
                )}

                {filterable && (
                  <Tooltip text="Toggle" placement="bottom">
                    <ButtonCircle
                      onClick={() => {
                        setState((state) => ({
                          ...state,
                          filterText: '',
                          toggleSearch: !state.toggleSearch,
                          resetPaginationToggle: !state.resetPaginationToggle,
                        }));
                      }}
                    >
                      <BiSearch className="fs-4" />
                    </ButtonCircle>
                  </Tooltip>
                )}
              </div>

              <FilterComponent
                onFilter={(e) =>
                  setState((state) => ({
                    ...state,
                    filterText: e.target.value,
                  }))
                }
                placeholder={`Search by ${`${getFilterableKeys(columns)
                  .slice(0, 2)
                  .join(', ')
                  .toLowerCase()}...`}`}
              />
            </div>
          )}
        </div>
      ) : null}

      <DataTable
        sortIcon={sortIcon}
        customStyles={customStyles}
        actions={selectableRows && <div></div>}
        paginationResetDefaultPage={state.resetPaginationToggle}
        {...props}
        data={filterable ? filteredData : data}
      />
    </Context.Provider>
  );
}

const sortIcon = <IoArrowDown className="mx-1" />;
const getKeys = (columns) => columns.filter((c) => c.key).map((c) => c.key);
const getColumnNames = (columns) =>
  columns.filter((c) => c.key).map((c) => c.name);
const getFilterableKeys = (columns) =>
  columns.filter((c) => c.filterable).map((c) => c.key);

export default DataTableBase;
