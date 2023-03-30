/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CgTrash } from 'react-icons/cg';
import Tooltip from '../Tooltip';
import { money, getOptionRequest } from '../../assets/lib/helpers';
import BudgetContext from '../../context/BudgetContext';

function EditItem({ item, budgetId }) {
  const config = getOptionRequest();
  const { budgets, setBudgets } = React.useContext(BudgetContext);
  const form = React.useRef(null);
  const [editItemMode, setEditItemMode] = React.useState(false);
  const [state, setState] = React.useState({
    modalInputTextName: item.name,
    amount: item.amount,
  });

  // Trigger edit item mode to change the view
  const preEditItem = async (inputEl) => {
    // Click cancel on all items that are open to edit
    document.querySelectorAll('.cancelEditItem').forEach((el) => el.click());

    //  Open item to edit
    setEditItemMode(true);

    // Focus clicked element item
    setTimeout(() => {
      if (inputEl === 'nameEl') form.current[0].focus();
      if (inputEl === 'plannedEl') form.current[1].focus();
    }, 100);
  };

  // Send request to edit item and update budget state
  const editItem = async (event) => {
    event.preventDefault();

    // Send request
    const options = {
      url: `/budget_item/${item.id}/`,
      data: {
        item: item.category,
        name: state.name,
        planned: state.planned,
        date: item.date,
        category: budgetId,
        created_by: 1,
      },
    };
    const response = await axios.put(options.url, options.data, config);

    // Return on error response
    if (!response.data) return;

    // Replace item within budget with the new response item
    // Return a new array of budgets
    const newBudgets = budgets.map((_bud) => {
      const bud = { ..._bud };

      if (bud.id === budgetId) {
        const index = bud.items.findIndex((itm) => itm.id === item.id);
        bud.items[index] = response.data;
      }

      return bud;
    });
    setBudgets(newBudgets);

    // Close item's edit mode
    setEditItemMode(false);
  };

  // Send request to remove item and update budget state
  const removeItem = async (event) => {
    event.preventDefault();

    // Send request
    const options = {
      url: `/budget_item/${item.id}/`,
    };
    const response = await axios.delete(options.url, config);

    // Return on error response
    if (response === undefined) return;

    // Remove deleted item from budget
    const newBudgets = budgets.map((_bud) => {
      const bud = { ..._bud };

      if (bud.id === budgetId) {
        bud.items = bud.items.filter((itm) => itm.id !== item.id);
      }
      return bud;
    });
    setBudgets(newBudgets);
  };

  return !editItemMode ? (
    <>
      <div className="col col-md-10">
        <div className="d-inline-flex align-items-center gap-2">
          {/* Delete */}
          <Tooltip text="Delete" placement="bottom">
            <div
              onClick={(event) => removeItem(event, item.id)}
              role="button"
              className="text-danger"
            >
              <CgTrash className="fs-5" />
            </div>
          </Tooltip>
          {/* Name */}
          <Tooltip text="Edit" placement="bottom">
            <div
              onClick={() => preEditItem('nameEl')}
              role="button"
              className="fw-semibold text-primary"
            >
              {item.name}
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="col col-md-2 text-end fw-semibold text-primary">
        {/* Planned */}
        <Tooltip text="Edit" placement="bottom">
          <span onClick={() => preEditItem('plannedEl')} role="button">
            {money(item.amount)}
          </span>
        </Tooltip>
      </div>
    </>
  ) : (
    <div className="col-12">
      <form ref={form} method="put" onSubmit={editItem}>
        <div className="d-lg-flex">
          <div className="col-12 col-lg-5 mb-2 mb-lg-0 me-lg-2">
            <input
              onChange={(event) =>
                setState({ ...state, modalInputTextName: event.target.value })
              }
              type="text"
              value={state.name}
              className="form-control"
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
              className="form-control"
              placeholder="Planned amount"
              name="planned"
            />
          </div>
          <div className="col-12 col-lg-2">
            <div className="d-flex justify-content-around">
              <button
                type="button"
                onClick={editItem}
                className="btn btn-link
             text-decoration-none fw-semibold text-truncate"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-link
             text-decoration-none fw-semibold cancelEditItem"
                onClick={() => setEditItemMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

EditItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.number.isRequired,
  }).isRequired,
  budgetId: PropTypes.number.isRequired,
};

export default EditItem;
