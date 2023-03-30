/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getOptionRequest } from '../../assets/lib/helpers';
import BudgetContext from '../../context/BudgetContext';

function AddItem({ budgetId }) {
  const config = getOptionRequest();
  const { datePicker, budgets, setBudgets } = React.useContext(BudgetContext);
  const [state, setState] = React.useState({
    modalInputTextName: '',
    planned: '',
  });

  // Send request to add a new item and update budget state
  const addItem = async (event) => {
    event.preventDefault();

    // Send request
    const options = {
      url: '/budget_item/',
      data: {
        name: state.name,
        planned: state.planned,
        date: datePicker.current.datepicker.getDate('yyyy-mm'),
        category: budgetId,
        created_by: 1,
      },
    };

    const response = await axios.post(options.url, options.data, config);

    // Return on error response
    if (!response.data) return;

    // Update and sort items
    const newBudgets = budgets.map((_bud) => {
      const bud = { ..._bud };

      if (bud.id === budgetId) {
        if (bud.items !== undefined) {
          bud.items = [...bud.items, response.data];
          bud.items.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else bud.items = [response.data];
      }
      return bud;
    });
    setBudgets(newBudgets);

    // Clear state
    setState({ modalInputTextName: '', planned: '' });
  };

  return (
    <div className="col-12">
      <form className="mb-2" method="post" onSubmit={addItem}>
        <div className="d-lg-flex">
          <div className="col-12 col-lg-5 mb-2 mb-lg-0 me-lg-2">
            <input
              onChange={(event) =>
                setState({ ...state, modalInputTextName: event.target.value })
              }
              type="text"
              value={state.name}
              className="form-control form-control-sm"
              placeholder="Item name"
              name="item"
            />
          </div>
          <div className="col-12 col-lg-5">
            <input
              onChange={(event) =>
                setState({ ...state, planned: event.target.value })
              }
              type="number"
              value={state.planned}
              step="0.50"
              className="form-control form-control-sm"
              placeholder="Planned amount"
              name="planned"
            />
          </div>
          <div className="col-12 col-lg-2 border">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                onClick={addItem}
                className="btn btn-sm btn-link text-decoration-none fw-semibold text-truncate"
              >
                Add New Item
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

AddItem.propTypes = {
  budgetId: PropTypes.number.isRequired,
};

export default AddItem;
