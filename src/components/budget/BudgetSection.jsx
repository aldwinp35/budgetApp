import React from 'react';
import PropTypes from 'prop-types';
import BudgetType from '../../types/BudgetType';
import DisplayBudgetItems from './DisplayBudgetItems';
import EditBudgetItems from './EditBudgetItems';

function BudgetSection({ budget }) {
  const [editMode, setEditMode] = React.useState(false);

  return (
    <div className="col-12">
      <div className="section">
        {/* Section Header */}
        <div className="d-flex align-items-center mb-3">
          <h5 title={budget.name} className="text-truncate">
            {budget.name}
          </h5>
        </div>
        {/* Table Content */}
        <div className="table-wrapper">
          {budget.items?.length > 0 ? (
            <>
              <div className="table-content">
                {!editMode ? (
                  <DisplayBudgetItems budget={budget} />
                ) : (
                  <EditBudgetItems budget={budget} />
                )}
              </div>
              <div className="d-flex gap-2 justify-content-between justify-content-sm-start">
                <button type="button" className="btn btn-primary text-truncate">
                  Add Expenses
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className="btn btn-link text-decoration-none fw-semibold text-truncate"
                >
                  {!editMode ? 'Edit Items' : 'Cancel'}
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className="btn btn-outline-dark"
                >
                  Add Items
                </button>
              ) : (
                <>
                  <EditBudgetItems budget={budget} />
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="btn btn-outline-dark"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

BudgetSection.propTypes = {
  budget: PropTypes.shape({ BudgetType }.propTypes).isRequired,
};

export default BudgetSection;
