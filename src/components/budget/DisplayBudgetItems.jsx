/* eslint-disable comma-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { money } from '../../assets/lib/helpers';

function useWindowWidth() {
  const [screenWidth, setScreenWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const getScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', getScreenWidth);
    getScreenWidth();
    return () => window.removeEventListener('resize', getScreenWidth);
  }, []);
  return screenWidth;
}

function DisplayBudgetItems({ budget }) {
  const width = useWindowWidth();

  const showTotal = () => {
    const amount = budget.items.reduce((sum, value) => sum + value.amount, 0);
    const spent = budget.items.reduce((sum, value) => sum + value.spent, 0);
    const difference = budget.items.reduce(
      (sum, value) => sum + value.difference,
      0
    );

    return { amount, spent, difference };
  };

  return width > 575 ? (
    <>
      <div className="header">
        <div className="d-flex py-1 px-2 rounded-1 mb-2">
          <div className="col col-md-6 fw-semibold">Items</div>
          <div className="col col-md-2 fw-semibold text-end">Amount</div>
          <div className="col col-md-2 fw-semibold text-end">Spent</div>
          <div className="col col-md-2 fw-semibold text-end">Difference</div>
        </div>
      </div>
      <div className="body">
        {budget.items.map((item) => (
          <div className="d-flex py-1 px-2 border rounded-1 mb-2" key={item.id}>
            <div className="col col-md-6">{item.name}</div>
            <div className="col col-md-2 text-end">{money(item.amount)}</div>
            <div className="col col-md-2 text-end">{money(item.spent)}</div>
            <div
              className={
                item.difference >= 0
                  ? 'col col-md-2 text-end text-success'
                  : 'col col-md-2 text-end text-danger'
              }
            >
              {money(item.difference)}
            </div>
          </div>
        ))}

        <div className="d-flex bg-light border py-1 px-2 rounded-1 mb-3">
          <div className="col col-md-6 fw-bold">Total</div>
          <div className="col col-md-2 fw-bold text-end">
            {money(showTotal().amount)}
          </div>
          <div className="col col-md-2 fw-bold text-end">
            {money(showTotal().spent)}
          </div>
          <div className="col col-md-2 fw-bold text-end">
            {money(showTotal().difference)}
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      {budget.items.map((item) => (
        <div key={item.id} className="mb-3">
          <div className="mb-2">
            <p className="fw-semibold">{item.name}</p>
          </div>
          <div className="mb-2">
            <div className="d-flex justify-content-between">
              <p>Planned</p>
              <p>{money(item.amount)}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>Spent</p>
              <p>{money(item.spent)}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>Difference</p>
              <p>{money(item.difference)}</p>
            </div>
          </div>
        </div>
      ))}

      <hr />
      <div className="mb-3">
        <div className="d-flex justify-content-between fw-semibold">
          <p>Planned</p>
          <p>{money(showTotal().amount)}</p>
        </div>
        <div className="d-flex justify-content-between fw-semibold">
          <p>Spent</p>
          <p>{money(showTotal().spent)}</p>
        </div>
        <div className="d-flex justify-content-between fw-semibold">
          <p>Difference</p>
          <p>{money(showTotal().difference)}</p>
        </div>
      </div>
    </>
  );
}

DisplayBudgetItems.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        amount: PropTypes.number,
        spent: PropTypes.number,
        difference: PropTypes.number,
        date: PropTypes.string,
        category: PropTypes.number,
        item: PropTypes.number,
        created_by: PropTypes.number,
        // eslint-disable-next-line comma-dangle
      })
    ),
  }).isRequired,
};

export default DisplayBudgetItems;
