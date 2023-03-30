import React from 'react';
import PropTypes from 'prop-types';
import { CgTrash } from 'react-icons/cg';
import { TbEdit } from 'react-icons/tb';
import { money } from '../../assets/lib/helpers';
import IncomeContext from '../../context/IncomeContext';

function TableRow({ income }) {
  const { state, setState, datepickerRef, showModal, removeIncome } =
    React.useContext(IncomeContext);

  function printDate(date) {
    const d = new Date(date);
    return d.toUTCString().slice(5, -13).replaceAll(' ', '-');
  }

  function showEditModal(inc) {
    setState({
      ...state,
      category: inc.category,
      amount: inc.amount,
      showEditModal: true,
      editingIncome: income.id,
    });
    datepickerRef.current.datepicker.setDate(new Date(income.date));
    showModal();
  }

  return (
    <tr className="align-middle">
      <td className="text-start">{income.name}</td>
      <td className="text-center">
        <span className="text-start table-td-width">
          <nobr>{printDate(income.date)}</nobr>
        </span>
      </td>
      <td className="text-center">
        <span className="text-end table-td-width">{money(income.amount)}</span>
      </td>
      <td className="text-end">
        <div className="d-inline-flex">
          <button
            type="button"
            onClick={() => showEditModal(income)}
            className="btn btn-bd-primary btn-sm me-2"
          >
            <TbEdit className="fs-6" />
          </button>
          <button
            type="button"
            onClick={() => removeIncome(income.id)}
            className="btn btn-bd-danger btn-sm"
          >
            <CgTrash className="fs-6" />
          </button>
        </div>
      </td>
    </tr>
  );
}

TableRow.propTypes = {
  income: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
};

export default TableRow;
