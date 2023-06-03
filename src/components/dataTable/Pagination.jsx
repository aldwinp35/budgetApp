/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import classnames from 'classnames';
import Context from './Context';

function Pagination({ totalRows }) {
  const { pageSize, setPageSize, currentPage, setCurrentPage } =
    React.useContext(Context);
  const pageCount = Math.ceil(totalRows / pageSize);

  function hasPrevious() {
    return currentPage > 1;
  }

  function getPrevious() {
    if (hasPrevious()) {
      setCurrentPage(currentPage - 1);
    }
  }

  function hasNext() {
    return currentPage < pageCount;
  }

  function getNext() {
    if (hasNext()) {
      setCurrentPage(currentPage + 1);
    }
  }

  function getFirst() {
    setCurrentPage(1);
  }

  function getLast() {
    setCurrentPage(pageCount);
  }

  function goTo(page) {
    setCurrentPage(page);
  }

  function status() {
    let showing = null;
    let to = null;

    if (currentPage === 1) {
      showing = currentPage;
    } else {
      showing = currentPage * pageSize - pageSize;
    }

    if (currentPage === pageCount) {
      to = totalRows;
    } else {
      to = currentPage * pageSize;
    }

    if (totalRows !== 0) {
      return window.innerWidth > 576
        ? `${showing} - ${to} of ${totalRows.toLocaleString()}`
        : `${currentPage} of ${pageCount}`;
    }

    return null;
  }

  return (
    <div className="d-flex justify-content-end align-items-center mt-2 gap-3">
      {/* {totalRows > pageSize ? ( */}

      <div className="m-0 d-flex align-items-center">
        <span className="me-2 small text-secondary">Rows:</span>
        <select
          title="Rows per page"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            getFirst();
          }}
          className="form-select form-select-sm border-0 rounded-0 border-bottom border-secondary w-fit"
        >
          {[10, 25, 50, 100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center small text-secondary">{status()}</div>

      <div className="d-flex gap-2">
        <div
          className={classnames('btn-circle', {
            disabled: !hasPrevious(),
          })}
          role="button"
          onClick={getPrevious}
        >
          <div className="d-flex align-items-center">
            <IoIosArrowBack className="fs-5" />
          </div>
        </div>

        <div
          className={classnames('btn-circle', { disabled: !hasNext() })}
          role="button"
          onClick={getNext}
        >
          <div className="d-flex align-items-center">
            <IoIosArrowForward className="fs-5" />
          </div>
        </div>
      </div>

      {/* ) : null} */}
    </div>

    // <div className="d-md-flex justify-content-between align-items-center">
    //   <div className="text-center text-md-start mb-2 mb-md-0">{status()}</div>
    //   {totalRows > pageSize ? (
    //     <ul className="pagination pagination-sm mb-0 justify-content-center justify-content-md-start">
    //       <li className={hasPrevious() ? 'page-item' : 'page-item disabled'}>
    //         <a
    //           className="page-link"
    //           href="#"
    //           tabIndex="-1"
    //           aria-disabled="true"
    //           onClick={getPrevious}
    //         >
    //           Previous
    //         </a>
    //       </li>
    //       {[...Array(pageCount).keys()].map((nPage) => (
    //         <li key={nPage} className="page-item">
    //           <a
    //             className={classnames('page-link', {
    //               active: nPage === currentPage - 1,
    //             })}
    //             href="#"
    //             onClick={() => goTo(nPage + 1)}
    //           >
    //             {nPage + 1}
    //           </a>
    //         </li>
    //       ))}
    //       <li className={hasNext() ? 'page-item' : 'page-item disabled'}>
    //         <a className="page-link" href="#" onClick={getNext}>
    //           Next
    //         </a>
    //       </li>
    //     </ul>
    //   ) : null}
    // </div>
  );
}

Pagination.propTypes = {
  totalRows: PropTypes.number.isRequired,
};

export default Pagination;
