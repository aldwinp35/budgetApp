import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Red, Green, Orange } from '../util/Markers';
import { toMoney } from '../../assets/lib/helpers';
import Context from '../../context/Context';
import Tooltip from '../util/Tooltip';

function Balance() {
  const { state, filterDate } = React.useContext(Context);

  const updateBar = React.useCallback(() => {
    // Get remaining income
    const p = Math.round((state.expenses / state.income) * 100);
    const barStatus = 100 - p;
    return barStatus || 0;
  });

  return (
    <div className="col-12">
      <div className="section" style={{ minHeight: 'unset' }}>
        <table className="mb-3 table table-sm table-borderless table-hover">
          <tbody>
            <tr>
              <td className="pe-4 d-flex align-items-center">
                <Green /> Income
              </td>
              <td className="text-end">
                {state.income === 0 ? (
                  <Link
                    to="/income"
                    state={{ dpDate: filterDate.current }}
                    className="text-danger"
                  >
                    <Tooltip
                      text="You have no income on this date. Please add income before adding items."
                      placement="bottom"
                    >
                      <IoWarningOutline className="fs-5 me-1" />
                    </Tooltip>
                  </Link>
                ) : null}
                {toMoney(state.income)}
              </td>
            </tr>
            <tr>
              <td className="pe-4 d-flex align-items-center">
                <Orange /> Planned
              </td>
              <td className="text-end">{toMoney(state.planned)}</td>
            </tr>
            <tr>
              <td className="pe-4 d-flex align-items-center">
                <Red /> Expenses
              </td>
              <td className="text-end">{toMoney(state.expenses)}</td>
            </tr>
            <tr className="border-dark border-top">
              <td className="pe-4 fw-semibold">&nbsp;&nbsp;Remaining</td>
              <td className="text-end fw-semibold">
                {toMoney(state.remainingBalance)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="progress" style={{ height: '10px' }}>
          <div
            style={{ width: `${updateBar()}%` }}
            className="progress-bar bg-primary rounded"
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
