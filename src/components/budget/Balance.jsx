/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
import React from 'react';
import { money } from '../../assets/lib/helpers';
import BudgetContext from '../../context/BudgetContext';

function Balance() {
  const { state } = React.useContext(BudgetContext);

  const updateBar = () => {
    const percentage = Math.round((state.expenses / state.income) * 100);
    const status = 100 - percentage;
    return status || 0;
  };

  return (
    <div className="col-12">
      <div className="section">
        <h5 className="mb-2">
          <span className="me-2">Remaining Balance</span>
          {money(state.remaining_balance)}
        </h5>
        <table className="mb-3">
          <tbody>
            <tr>
              <td className="fw-semibold pe-4">My Income</td>
              <td>{money(state.income)}</td>
            </tr>
            <tr>
              <td className="fw-semibold pe-4">Total Expenses</td>
              <td>{money(state.expenses)}</td>
            </tr>
            {/* <tr>
              <td className="fw-semibold pe-4">Total Expenses</td>
              <td>{money(overview.expenses)}</td>
            </tr> */}
          </tbody>
        </table>
        <div className="progress" style={{ height: '10px' }}>
          <div
            style={{ width: `${updateBar()}%` }}
            className={
              updateBar() >= 80
                ? 'progress-bar bg-danger rounded'
                : 'progress-bar bg-primary rounded'
            }
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="75"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Balance;
