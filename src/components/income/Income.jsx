import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../util/Loading';
import ManageIncome from './ManageIncome';
import ManageCategoryModal from './ManageCategoryModal';
import AddEditModal from './AddEditModal';
import AddCategoryModal from './AddCategoryModal';
import IncomeSection from './IncomeSection';
// import CategorySection from './CategorySection';
// import BlankStateIncome from './BlankStateIncome';
import DoughnutChart from './DoughnutChart';
import Context from '../../context/Context';

function Income() {
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

  // LocationState could have a filterDate that
  //  is passed throug when the Link "add income warning icon" is clicked
  //  on the budget page
  const { state: locationState } = useLocation();
  const filterDate = useRef(locationState?.dpDate || null);
  const datePicker = React.useRef(null);

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
          <div className="col-12 col-sm-6 col-lg-3">
          {/* <CategorySection /> */}
          <DoughnutChart />
          </div>
        </div>
      )}

      {/* {state.incomeList && !state.incomeList.length && (
        <BlankStateIncome showModal={toggleAddEditModal} />
      )} */}

      <AddEditModal />
      <AddCategoryModal />
      <ManageCategoryModal />
    </Context.Provider>
  );
}

export default Income;
