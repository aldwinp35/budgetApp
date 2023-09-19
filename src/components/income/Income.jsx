import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import Loading from '../util/Loading';
import ManageIncome from './ManageIncome';
import ManageCategoryModal from './ManageCategoryModal';
import AddEditModal from './AddEditModal';
import AddCategoryModal from './AddCategoryModal';
import IncomeSection from './IncomeSection';
// import BlankStateIncome from './BlankStateIncome';
import DoughnutChart from './DoughnutChart';
import Context from '../../context/Context';

function Income() {
  const datePicker = React.useRef(null);
  const [state, setState] = useState({
    incomeList: null,
    categoryList: null,
    incomeToEdit: null,
    selectedRows: null,
    toggleCleared: false,
    modalManageCategory: false,
    modalAddEdit: false,
    modalAddCategory: false,
    loading: false,
  });

  const filterDate = useRef(null);

  // Sort categories in alphabetical order when the list is updated
  useEffect(() => {
    setState((state) => ({
      ...state,
      categoryList: state.categoryList?.sort((a, b) =>
        a.name > b.name ? 1 : -1
      ),
    }));
  }, [state.categoryList]);

  const toggleManageCategoryModal = useCallback(
    () =>
      setState((state) => ({
        ...state,
        modalManageCategory: !state.modalManageCategory,
      })),
    []
  );

  const toggleAddCategoryModal = useCallback(
    () =>
      setState((state) => ({
        ...state,
        modalAddCategory: !state.modalAddCategory,
      })),
    []
  );

  const toggleAddEditModal = useCallback(
    () =>
      setState((state) => ({
        ...state,
        modalAddEdit: !state.modalAddEdit,
      })),
    []
  );

  const value = useMemo(() => ({
    datePicker,
    filterDate,
    state,
    setState,
    toggleManageCategoryModal,
    toggleAddEditModal,
    toggleAddCategoryModal,
  }));

  return (
    <Context.Provider value={value}>
      <div className="row mb-3">
        <ManageIncome />
      </div>

      {!state.incomeList && <Loading color="secondary" />}
      {state.incomeList && (
        <div className="row mb-3">
          <IncomeSection />
          <DoughnutChart />
        </div>
      )}

      {/* {state.incomeList && !state.incomeList.length && (
        <BlankStateIncome showModal={toggleAddEditModal} />
      )} */}

      <ManageCategoryModal />
      <AddEditModal />
      <AddCategoryModal />
    </Context.Provider>
  );
}

export default Income;
