import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { CgMathPlus } from 'react-icons/cg';
import { TbDotsVertical, TbEdit, TbTrash } from 'react-icons/tb';
import {
  // Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
// import DisplayBudgetItems from './DisplayBudgetItems';
// import EditBudgetItems from './EditBudgetItems';

import Context from '../../context/Context';
import AddEditItemModal from './AddEditItemModal';
import BudgetType from '../../types/BudgetType';
import DataTable from '../dataTable/DataTableBase';
import { handleErrorResponse, toMoney } from '../../assets/lib/helpers';
import ButtonCircle from '../util/ButtonCircle';
import Tooltip from '../util/Tooltip';
import { budgetService, alertService } from '../../api';

BudgetSection.propTypes = {
  budget: PropTypes.shape({ BudgetType }.propTypes).isRequired,
};

function BudgetSection({ budget }) {
  const [state, setState] = useState({
    itemList: budget.items,
    categoryList: null,
    itemToEdit: null,
    modalAddEdit: false,
  });

  const { filterDate } = useContext(Context);

  useEffect(() => {
    budgetService.getItemCategoryByBudgetId(budget.id).then((res) => {
      if (res.status === 200) {
        setState((state) => ({ ...state, categoryList: res.data.results }));
      }
    });
  }, []);

  useEffect(() => {
    setState((state) => ({ ...state, itemList: budget.items }));
  }, [budget.items]);

  // Add category
  const toggleAddEditModal = useCallback(
    () =>
      setState((state) => ({
        ...state,
        modalAddEdit: !state.modalAddEdit,
      })),
    []
  );

  const DATA_LENGTH = budget.items.length;
  const MIN_DATA_LENGTH = 15;
  const SHOW_OPTION = DATA_LENGTH > MIN_DATA_LENGTH ? true : false;

  // Rows action (Edit / Delete)
  const rowAction = useCallback(
    (row) => (
      <UncontrolledDropdown>
        <DropdownToggle data-toggle="dropdown" tag="div">
          <ButtonCircle small>
            <TbDotsVertical className="fs-5" />
          </ButtonCircle>
        </DropdownToggle>
        <DropdownMenu className="border-0 shadow" container="body">
          <DropdownItem
            onClick={() => {
              setState((state) => ({ ...state, itemToEdit: row }));
              toggleAddEditModal();
            }}
          >
            <TbEdit className="fs-5 me-3" />
            Edit
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              const result = confirm('Are you trying to delete this item?');
              if (!result) return;

              budgetService
                .removeItem(row.id)
                .then((res) => {
                  if (res.status === 204) {
                    setState((state) => ({
                      ...state,
                      itemList: state.itemList.filter((x) => x.id !== row.id),
                    }));

                    alertService.info('Item deleted');
                  }
                })
                .catch(handleErrorResponse);
            }}
          >
            <TbTrash className="fs-5 me-3" />
            Delete
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
    [state.itemList]
  );

  // Main action (Add new item)
  const addNewItem = useMemo(
    () => (
      // <Button className="w-100 border" color="light">
      //   Add Item
      // </Button>

      <Tooltip text="Add item" placement="bottom">
        <ButtonCircle onClick={toggleAddEditModal}>
          <CgMathPlus />
        </ButtonCircle>
      </Tooltip>
    ),
    [state.itemList]
  );

  const columns = React.useMemo(
    () => [
      {
        key: 'name',
        name: 'Item',
        selector: (row) => row.name,
        sortable: SHOW_OPTION,
        filterable: true,
      },
      {
        key: 'amount',
        name: 'Planned',
        selector: (row) => toMoney(row.amount),
        right: true,
        sortable: SHOW_OPTION,
        filterable: true,
      },
      {
        key: 'spent',
        name: 'Spent',
        selector: (row) => toMoney(row.spent),
        right: true,
        sortable: SHOW_OPTION,
        filterable: true,
      },
      {
        key: 'difference',
        name: 'Difference',
        selector: (row) =>
          row.difference > 0 ? (
            <div className="text-success">{toMoney(row.difference)}</div>
          ) : (
            <div className="text-danger">{toMoney(row.difference)}</div>
          ),
        right: true,
        sortable: SHOW_OPTION,
        filterable: true,
      },
      {
        cell: rowAction,
        button: true,
        allowOverflow: true,
        style: {
          display: 'flex',
          justifyContent: 'end',
          paddingRight: '10px',
        },
      },
    ],
    [budget]
  );

  const value = useMemo(() => ({
    state,
    setState,
    toggleAddEditModal,
    filterDate,
    budget,
  }));

  return (
    <Context.Provider value={value}>
      <div className="col-12">
        <div
          className="section"
          style={{ minHeight: DATA_LENGTH > 0 && 'unset' }}
        >
          <DataTable
            title={budget.name}
            actions={addNewItem}
            columns={columns}
            data={state.itemList}
            pagination={SHOW_OPTION}
            selectableRows={SHOW_OPTION}
            noDataComponent={
              <p className="fst-italic text-secondary text-center py-5">
                No items on this date
              </p>
            }
          />
        </div>
        <AddEditItemModal />
      </div>
    </Context.Provider>
  );

  // const [editMode, setEditMode] = React.useState(false);
  //   return (
  //     <div className="col-12">
  //       <div className="section">
  //         {/* Section Header */}
  //         <div className="d-flex align-items-center mb-3">
  //           <h5 title={budget.name} className="text-truncate">
  //             {budget.name}
  //           </h5>
  //         </div>
  //         {/* Table Content */}
  //         <div className="table-wrapper">
  //           {budget.items?.length > 0 ? (
  //             <>
  //               <div className="table-content">
  //                 {!editMode ? (
  //                   <DisplayBudgetItems budget={budget} />
  //                 ) : (
  //                   <EditBudgetItems budget={budget} />
  //                 )}
  //               </div>
  //               <div className="d-flex gap-2 justify-content-between justify-content-sm-start">
  //                 <button type="button" className="btn btn-primary text-truncate">
  //                   Add Expenses
  //                 </button>
  //                 <button
  //                   type="button"
  //                   onClick={() => setEditMode(!editMode)}
  //                   className="btn btn-link text-decoration-none fw-semibold text-truncate"
  //                 >
  //                   {!editMode ? 'Edit Items' : 'Cancel'}
  //                 </button>
  //               </div>
  //             </>
  //           ) : (
  //             <div className="d-flex flex-column">
  //               {!editMode ? (
  //                 <button
  //                   type="button"
  //                   onClick={() => setEditMode(!editMode)}
  //                   className="btn btn-outline-dark"
  //                 >
  //                   Add Items
  //                 </button>
  //               ) : (
  //                 <>
  //                   <EditBudgetItems budget={budget} />
  //                   <button
  //                     type="button"
  //                     onClick={() => setEditMode(!editMode)}
  //                     className="btn btn-outline-dark"
  //                   >
  //                     Cancel
  //                   </button>
  //                 </>
  //               )}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
}

export default BudgetSection;
