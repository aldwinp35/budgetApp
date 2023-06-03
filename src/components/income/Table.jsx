import React from 'react';
import axios from 'axios';
import { CgTrash } from 'react-icons/cg';
import { TbEdit } from 'react-icons/tb';
import Datatable from '../datatable/DataTable';
import IncomeContext from '../../context/IncomeContext';
import { getOptionRequest } from '../../assets/lib/helpers';

function Table() {
  const config = getOptionRequest();
  const { state, setState, modalInputDate, showModal } =
    React.useContext(IncomeContext);

  function editRow(id) {
    function action() {
      /* Open modal and set data in it */
      const income = state.incomeList.find((inc) => inc.id === id);
      setState({
        ...state,
        category: income.category,
        amount: income.amount,
        showEditModal: true,
        editingIncome: id,
      });
      modalInputDate.current.datepicker.setDate(new Date(income.date));
      showModal();
    }
    return (
      <button
        type="button"
        onClick={action}
        className="btn btn-bd-primary btn-sm"
      >
        <TbEdit className="fs-6" />
      </button>
    );
  }

  function deleteRow(id) {
    async function action() {
      const result = confirm('Are you sure want to delete this income?');
      if (!result) {
        return;
      }

      try {
        const response = await axios.delete(`/income/${id}/delete/`, config);
        if (response.status === 204) {
          setState({
            ...state,
            incomeList: state.incomeList.filter((income) => income.id !== id),
          });
        }
      } catch (error) {
        if (error?.response) {
          console.log('Error: ', error.response.data);
        }
      }
    }
    return (
      <button
        type="button"
        onClick={action}
        className="btn btn-bd-danger btn-sm"
      >
        <CgTrash className="fs-6" />
      </button>
    );
  }

  return (
    <div className="col-12 col-lg-9">
      <div className="section">
        <Datatable
          options={{
            title: 'Income',
            data: () => state.incomeList,
            rowActions: {
              edit: editRow,
              deleteBtn: deleteRow,
            },
            formats: {
              money: ['amount'],
              date: ['date'],
            },
            fields: ['name', 'date', 'amount'],
          }}
        />
      </div>
    </div>
  );
}

export default Table;
