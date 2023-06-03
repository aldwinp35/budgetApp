/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
import React from 'react';
import { Modal as BSModal } from 'bootstrap';
import { CiCalendar } from 'react-icons/ci';
import DatePicker from '../DatePicker';
import budgetService from '../../api/budgetService';
import BudgetContext from '../../context/BudgetContext';

function ManageBudget() {
  const { state, setState, datePicker, modalManageCategory } = React.useContext(BudgetContext);

  function showHidePicker() {
    if (!datePicker.current.datepicker.active) {
      datePicker.current.datepicker.show();
    } else datePicker.current.datepicker.hide();
  }

  function showModal() {
    const bsModal = new BSModal(modalManageCategory.current, {
      backdrop: 'static',
      keyboard: false,
    });
    bsModal.show();
  }

  async function loadBudgets() {
    const month = datePicker.current.datepicker.getDate('mm');
    const year = datePicker.current.datepicker.getDate('yyyy');
    const balanceResponse = await budgetService.getBalance(month, year);
    const budgetResponse = await budgetService.getBudgetCategories(month, year);
    setState({
      ...state,
      budgets: budgetResponse.data.results,
      expenses: balanceResponse.data.expenses,
      income: balanceResponse.data.income,
      remaining_balance: balanceResponse.data.balance,
    });
  }
  return (
    <div className="col-12">
      <div className="d-sm-flex justify-content-sm-between">
        <div className="mb-2 mb-sm-0">
          <button onClick={showModal} className="btn btn-primary" type="button">
            Manage Categories
          </button>
        </div>
        <div className="position-relative">
          <DatePicker
            refInput={datePicker}
            options={{
              pickLevel: '1',
              autohide: true,
              format: 'MM yyyy',
              buttonClass: 'btn',
              showOnClick: false,
              showOnFocus: false,
              beforeShowMonth(date) {
                switch (date.getMonth()) {
                  case 6:
                    if (date.getFullYear() === new Date().getFullYear()) {
                      return { content: '🔹' };
                    }
                    break;
                  case 8:
                    return 'highlighted';
                }
              },
            }}
            onChange={() => loadBudgets()}
          >
            <input type="text" className="form-control" />
          </DatePicker>
          <CiCalendar
            onClick={() => showHidePicker()}
            role="button"
            className="fs-4"
            style={{ position: 'absolute', top: '6px', right: '5px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageBudget;
