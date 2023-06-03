import React from 'react';
import PropTypes from 'prop-types';
import { CgTrash } from 'react-icons/cg';
import { TbEdit } from 'react-icons/tb';
import { money, printDate } from '../../assets/lib/helpers';
import IncomeContext from '../../context/IncomeContext';

function TableRow({ income }) {
  const { state, setState, modalInputDate, showModal, removeIncome } =
    React.useContext(IncomeContext);

  function showEditModal(inc) {
    setState({
      ...state,
      category: inc.category,
      amount: inc.amount,
      showEditModal: true,
      editingIncome: income.id,
    });
    modalInputDate.current.datepicker.setDate(new Date(income.date));
    showModal();
  }

  return (
    <tr className="align-middle">
      <td className="text-nowrap">
        <span className="me-4">{income.name}</span>
      </td>
      <td className="text-nowrap">
        <span className="me-0">{printDate(income.date)}</span>
      </td>
      <td>
        <span className="me-4">{money(income.amount)}</span>
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
