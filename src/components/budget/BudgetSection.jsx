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
  const { setState } = useContext(Context);
  const [itemList, setItemList] = useState(budget.items);
  const [categoryList, setCategoryList] = useState(null);
  const [modalAddEdit, setModalAddEdit] = useState(false);

  // Update when budgetList is changed throuth datepicker
  useEffect(() => {
    setItemList(budget.items);
  }, [budget]);

  // Get item categories
  useEffect(() => {
    budgetService.getItemCategoryByBudgetId(budget.id).then((res) => {
      if (res.status === 200) {
        setCategoryList(res.data.results);
      }
    });
  }, []);

  // Add category
  const toggleAddEditModal = () => setModalAddEdit(!modalAddEdit);

  const DATA_LENGTH = itemList.length;
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
                    const newItems = itemList.filter((x) => x.id !== row.id);
                    setItemList(newItems);
                    setState((state) => ({
                      ...state,
                      budgetList: state.budgetList.map((b) => {
                        if (b.id === budget.id) b.items = newItems;
                        return b;
                      }),
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
    [itemList]
  );

  // Main action (Add new item)
  const addNewItem = useMemo(
    () => (
      <Tooltip text="Add item" placement="bottom">
        <ButtonCircle
          onClick={() => {
            toggleAddEditModal();
          }}
        >
          <CgMathPlus />
        </ButtonCircle>
      </Tooltip>
    ),
    [itemList]
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
        name: 'Remaining',
        selector: (row) => (
          <div className={row.difference > 0 ? 'text-success' : 'text-danger'}>
            {toMoney(row.difference)}
          </div>
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

  return (
    <div className="col-12">
      <div
        className="section"
        style={{ minHeight: DATA_LENGTH > 0 && 'unset' }}
      >
        <DataTable
          title={budget.name}
          actions={addNewItem}
          columns={columns}
          data={itemList}
          pagination={SHOW_OPTION}
          selectableRows={SHOW_OPTION}
          noDataComponent={
            <p className="fst-italic text-secondary text-center py-5">
              No items on this date
            </p>
          }
        />
      </div>
      <AddEditItemModal
        budget={budget}
        itemList={itemList}
        setItemList={setItemList}
        categoryList={categoryList}
        modalAddEdit={modalAddEdit}
        toggleAddEditModal={toggleAddEditModal}
      />
    </div>
  );
}

export default BudgetSection;
