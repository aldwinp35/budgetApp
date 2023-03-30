import React from 'react';
import { TbDotsVertical, TbFilter, TbArrowsSort } from 'react-icons/tb';
import TableRow from './TableRow';
import Tooltip from '../Tooltip';
import IncomeContext from '../../context/IncomeContext';

function Table() {
  const { state, showModal } = React.useContext(IncomeContext);

  return (
    <div className="col-12 col-lg-9">
      <div className="section">
        <div className="d-flex justify-content-between mb-3">
          <button type="button" className="btn btn-primary" onClick={showModal}>
            New Income
          </button>

          <div className="dropdown">
            <div
              className="btn-circle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Tooltip text="Options">
                <span className="d-flex">
                  <TbDotsVertical className="fs-5" />
                </span>
              </Tooltip>
            </div>
            <ul className="dropdown-menu border-0 shadow">
              <li>
                <a className="dropdown-item" href="#">
                  <TbArrowsSort className="fs-5 me-3" />
                  Sort
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <TbFilter className="fs-5 me-3" />
                  Filter
                </a>
              </li>
              <hr />
              <li>
                <a className="dropdown-item" href="#">
                  Last 30 days
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Last 6 month
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Custom
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className="text-center text-md-start">Name</th>
                <th className="text-center">
                  <span className="text-start table-td-width">Date</span>
                </th>
                <th className="text-center">
                  <span className="text-end table-td-width">Amount</span>
                </th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {state.incomeList.map((income) => (
                <TableRow key={income.id} income={income} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
