import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import Loading from '../util/Loading';
import ManageCategoryModal from './ManageCategoryModal';
import AddCategoryModal from './AddCategoryModal';
import ManageBudget from './ManageBudget';
import Balance from './Balance';
import BudgetSection from './BudgetSection';
import Context from '../../context/Context';
import './budget.css';

function Budget() {
  const [state, setState] = useState({
    budgetList: null,
    expenses: 0,
    income: 0,
    remainingBalance: 0,
    modalManageCategory: false,
    modalAddCategory: false,
  });

  const filterDate = useRef(null);

  // Sort budgets in alphabetical order when the list is updated
  useEffect(() => {
    setState((state) => ({
      ...state,
      budgetList: state.budgetList?.sort((a, b) => (a.name > b.name ? 1 : -1)),
    }));
  }, [state.budgetList]);

  // Add category
  const toggleAddCategoryModal = useCallback(
    () =>
      setState((state) => ({
        ...state,
        modalAddCategory: !state.modalAddCategory,
      })),
    []
  );

  // Manage category
  const toggleManageCategoryModal = useCallback(
    () =>
      setState((state) => ({
        ...state,
        modalManageCategory: !state.modalManageCategory,
      })),
    []
  );

  const value = useMemo(() => ({
    filterDate,
    state,
    setState,
    toggleAddCategoryModal,
    toggleManageCategoryModal,
  }));

  return (
    <Context.Provider value={value}>
      <div className="row mb-3 gap-3">
        <ManageBudget />
        <Balance />

        {!state.budgetList && <Loading color="secondary" />}

        {state.budgetList &&
          state.budgetList.map((budget) => (
            <BudgetSection key={budget.id} budget={budget} />
          ))}
      </div>
      <ManageCategoryModal />
      <AddCategoryModal />
    </Context.Provider>
  );
}

export default Budget;
