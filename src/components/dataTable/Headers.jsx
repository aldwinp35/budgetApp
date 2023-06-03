import React from 'react';
import { IoArrowDown } from 'react-icons/io5';
import Context from './Context';
import { toTitleCase } from './helpers';

function Headers() {
  const {
    keys,
    rowActions,
    moneyFields,
    setSelectedOrder,
    selectedOrder,
    orders,
  } = React.useContext(Context);

  if (!keys) {
    return null;
  }

  return (
    <tr>
      {keys.map((key, index) => (
        <th key={index} className="align-middle fw-semibold">
          <div
            className={moneyFields.has(key) ? 'd-flex justify-content-end' : ''}
          >
            <div
              className="d-inline-flex align-items-center"
              onClick={() => {
                setSelectedOrder({
                  name: key,
                  ascending: !orders[key].ascending,
                });
                orders[key].ascending = !orders[key].ascending;
              }}
              role="button"
            >
              <div className="text-nowrap me-2">{toTitleCase(key)}</div>
              {selectedOrder.name === key ? (
                <IoArrowDown
                  className={
                    selectedOrder.ascending
                      ? 'turn-icon-up text-primary no-print'
                      : 'turn-icon-down text-primary no-print'
                  }
                />
              ) : (
                <IoArrowDown className="no-print" style={{ opacity: 0.2 }} />
              )}
            </div>
          </div>
        </th>
      ))}
      {rowActions && Object.keys(rowActions).length !== 0 ? (
        <th>&nbsp;</th>
      ) : null}
      {/* {rowActions && Object.keys(rowActions).length !== 0 ? <th>Action</th> : null} */}
    </tr>
  );
}

export default Headers;
