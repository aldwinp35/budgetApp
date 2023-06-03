import React from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import { toMoney, toDate } from './helpers';
import DropDownOptions from './DropDownOptions';

function Rows({ item }) {
  const { rowActions, keys, moneyFields, dateFields } =
    React.useContext(Context);

  if (!keys) {
    return null;
  }

  /**
   * Decide how to render each row's value.
   */
  function toValue(key, value) {
    let val = value;

    // If it's an array, only render: Array(nElement)
    if (Array.isArray(val)) {
      val = `Array(${val.length})`;
    }

    // Render money format
    if (moneyFields.has(key)) {
      val = toMoney(val);
    }

    // Render date format
    if (dateFields.has(key)) {
      val = toDate(val);
    }

    return val;
  }

  return (
    <tr className="align-middle">
      {keys.map((key, index) => (
        <td
          key={index}
          className={
            moneyFields.has(key) ? 'text-nowrap text-end' : 'text-nowrap'
          }
        >
          <span>{toValue(key, item[key])}</span>
        </td>
      ))}
      {rowActions && Object.keys(rowActions).length !== 0 ? (
        <td>
          <div className="d-flex justify-content-end">
            <DropDownOptions item={item} />
          </div>
        </td>
      ) : null}
    </tr>
  );
}

Rows.propTypes = {
  item: PropTypes.instanceOf(Object).isRequired,
};

export default Rows;
