import React, { useMemo, useCallback, useContext } from 'react';
import {
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import { TbDotsVertical, TbEdit, TbTrash } from 'react-icons/tb';
import { CgTrash } from 'react-icons/cg';

import Loading from '../util/Loading';
import DataTable from '../dataTable/DataTableBase';
import ButtonCircle from '../util/ButtonCircle';
import Context from '../../context/Context';
import { alertService } from '../../api/alertService';
import { toMoney, handleErrorResponse } from '../../assets/lib/helpers';
import { incomeService } from '../../api';

function IncomeSection() {
  const { state, setState, toggleAddEditModal, filterDate } =
    useContext(Context);
  const DATA_LENGTH = state.incomeList.length;
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
              setState((state) => ({ ...state, incomeToEdit: row }));
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

              incomeService
                .remove(row.id)
                .then((res) => {
                  if (res.status === 204) {
                    setState((state) => ({
                      ...state,
                      incomeList: state.incomeList.filter(
                        (x) => x.id !== row.id
                      ),
                    }));

                    alertService.info('Income deleted');
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
    [state.incomeList]
  );

  // Handle selected rows
  const handleSelectedRows = useCallback((selection) => {
    setState((state) => ({ ...state, selectedRows: selection.selectedRows }));
  }, []);

  // Delete selected rows
  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      const result = confirm('Are you trying to delete the selected items?');
      if (!result) return;

      setState((state) => ({
        ...state,
        toggleCleared: !state.toggleCleared,
      }));

      // Get the ids of the items to be remove
      const ids = state.selectedRows.map((x) => x.id);

      incomeService
        .removeBulk(ids)
        .then((res) => {
          if (res.status === 204) {
            setState((state) => ({
              ...state,
              incomeList: state.incomeList.filter(
                (x) => ids.indexOf(x.id) !== -1
              ),
            }));

            alertService.info('Selected items deleted');
          }
        })
        .catch(handleErrorResponse);
    };

    return (
      <Button key="delete" onClick={handleDelete} color="danger">
        <CgTrash className="fs-5" />
      </Button>
    );
  }, [state.incomeList, state.selectedRows, state.toggleCleared]);

  // Colunms for the datatable
  const columns = useMemo(
    () => [
      {
        key: 'name',
        name: 'Name',
        selector: (row) => row.name,
        sortable: SHOW_OPTION,
        filterable: true,
      },
      {
        key: 'date',
        name: 'Date',
        selector: (row) => row.date,
        format: (row) => {
          return new Date(`${row.date}\n`).toLocaleDateString('en-us', {
            // weekday: 'short',
            day: '2-digit',
            month: 'short',
            // year: 'numeric',
          });
        },
        sortable: SHOW_OPTION,
        filterable: true,
      },
      {
        key: 'amount',
        name: 'Amount',
        selector: (row) => row.amount,
        format: (row) => toMoney(row.amount),
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
    [state.incomeList]
  );

  return (
    <div className="col-12 col-lg-9 mb-3 mb-lg-0">
      {state.loading && (
        <div className="section d-flex flex-column justify-content-center">
          <Loading color="secondary" />
        </div>
      )}

      {!state.loading && (
        <div
          className="section"
          style={{ minHeight: DATA_LENGTH > 0 && 'unset' }}
        >
          <DataTable
            customTitle={
              state.incomeList.length > 0 ? (
                <div className="text-center text-md-start">
                  {filterDate.current.toLocaleDateString('en-us', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              ) : null
            }
            columns={columns}
            data={state.incomeList}
            printable={SHOW_OPTION}
            filterable={SHOW_OPTION}
            exportable={SHOW_OPTION}
            selectableRows={SHOW_OPTION}
            contextActions={contextActions}
            onSelectedRowsChange={handleSelectedRows}
            clearSelectedRows={state.toggleCleared}
            pagination={SHOW_OPTION}
            noDataComponent={
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: '215px' }}
              >
                <div className="fst-italic text-secondary text-center">
                  No incomes on this date
                </div>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

export default IncomeSection;
