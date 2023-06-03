import React from 'react';
import Modal from './Modal';
import BudgetSection from './BudgetSection';
import Balance from './Balance';
import BudgetContext from '../../context/BudgetContext';
import ManageBudget from './ManageBudget';
import './budget.css';

function Budget() {
  const datePicker = React.useRef();
  const modalManageCategory = React.useRef();
  const [state, setState] = React.useState({
    budgets: [],
    expenses: 0,
    income: 0,
    remaining_balance: 0,
  });

  // Set current date to loads data
  React.useEffect(() => {
    datePicker.current.datepicker.setDate(new Date());
  }, []);

  const value = React.useMemo(() => ({
    datePicker,
    modalManageCategory,
    state,
    setState,
  }));

  return (
    <BudgetContext.Provider value={value}>
      <div className="row gap-3 mb-3">
        <ManageBudget />
        {/* <Balance /> */}
        {state.budgets?.map((budget) => (
          <BudgetSection key={budget.id} budget={budget} />
        ))}
      </div>
      <Modal />
    </BudgetContext.Provider>
  );
}

export default Budget;
