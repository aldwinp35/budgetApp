import React from 'react';
import { TbDotsVertical, TbEdit } from 'react-icons/tb';
import { CgTrash } from 'react-icons/cg';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import Context from './Context';


function DropDownOptions({ item }) {
  const { rowActions } = React.useContext(Context);

  return (
    <div className="dropdown">
      <div
        className="btn-circle"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Tooltip text="Actions">
          <span className="d-flex">
            <TbDotsVertical className="fs-5" />
          </span>
        </Tooltip>
      </div>
      <ul className="dropdown-menu border-0 shadow">
        <li>
          {rowActions.edit ? (
            <a
              onClick={() => rowActions.edit(item.id)}
              className="dropdown-item d-flex align-items-center"
              href="#"
            >
              <TbEdit className="fs-5 me-3" />
              Edit
            </a>
          ) : null}

          {rowActions.delete ? (
            <a
              onClick={() => rowActions.delete(item.id)}
              className="dropdown-item d-flex align-items-center"
              href="#"
            >
              <CgTrash className="fs-5 me-3" />
              Delete
            </a>
          ) : null}
        </li>
      </ul>
    </div>
  );
}

DropDownOptions.propTypes = {
  item: PropTypes.instanceOf(Object).isRequired,
};

export default DropDownOptions;
