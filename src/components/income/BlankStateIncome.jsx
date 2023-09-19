import React from 'react';
import blankState from '../../assets/img/blankState.svg';

function BlankStateIncome({ showModal }) {
  return (
    <div className="col-12">
      <div className="section py-5">
        <div className="d-flex justify-content-center">
          <img src={blankState} draggable="false" alt="Blank State Income" />
        </div>
        <div className="text-center">
          <p className="m-1 fs-5 fw-semibold gray-1">
            Add and manage your Income
          </p>
          <p className="gray-2 mb-2">
            This is where you&apos;ll add income to be shown in your budget.
          </p>
          <button type="button" className="btn btn-primary" onClick={showModal}>
            Add income
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlankStateIncome;
