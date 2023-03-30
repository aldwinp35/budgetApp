/* eslint-disable jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';
import AddItem from './AddItem';
import EditItem from './EditItem';

function EditBudgetItems({ budget }) {
  return (
    <>
      {budget?.items?.length > 0 ? (
        <div className="header">
          <div className="d-flex py-1 px-2 rounded-1 mb-2">
            <div className="col col-md-10 fw-semibold">Items</div>
            <div className="col col-md-2 fw-semibold text-end">Amount</div>
          </div>
        </div>
      ) : null}
      <div className="body">
        {budget?.items?.map((item) => (
          <div className="d-flex py-1 px-2 border rounded-1 mb-2" key={item.id}>
            <EditItem item={item} budgetId={budget.id} />
          </div>
        ))}

        <AddItem budgetId={budget.id} />
      </div>
    </>
  );
}

EditBudgetItems.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        amount: PropTypes.number,
        // eslint-disable-next-line comma-dangle
      })
    ),
  }).isRequired,
};

export default EditBudgetItems;
