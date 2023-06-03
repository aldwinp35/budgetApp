import React from 'react';
import { TbDotsVertical, TbPrinter, TbTableExport } from 'react-icons/tb';
import Tooltip from '../Tooltip';

function Dropdown() {
  return (
    <div className="d-flex justify-content-end mb-3">
      <div className="dropdown">
        <div className="btn-circle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <Tooltip text="Options">
            <span className="d-flex">
              <TbDotsVertical className="fs-5" />
            </span>
          </Tooltip>
        </div>
        <ul className="dropdown-menu border-0 shadow">
          <li>
            <a className="dropdown-item" href="#">
              <TbPrinter className="fs-5 me-3" />
              Print
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              <TbTableExport className="fs-5 me-3" />
              Export
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
  );
}

export default Dropdown;
