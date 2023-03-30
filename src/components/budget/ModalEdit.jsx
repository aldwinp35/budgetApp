/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { TbCheck, TbArrowBackUp, TbPencil } from 'react-icons/tb';
import { CgTrash } from 'react-icons/cg';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import budgetService from '../../api/budgetService';
import BudgetContext from '../../context/BudgetContext';

function ModalEdit({ budget, setBudgets, resetShowEdit }) {
  const errorMessage = React.useRef();
  const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
  const { state, setState } = React.useContext(BudgetContext);

  const [modalState, setModalState] = React.useState({
    inputTextName: '',
    edit: false,
  });

  function setEditModeHandler() {
    resetShowEdit();
    setModalState({ inputTextName: budget.name, edit: true });
  }

  async function editCategory(event, id, name) {
    event.preventDefault();

    try {
      const response = await budgetService.editBudgetCategory({
        id,
        name,
      });

      if (response.data) {
        const newBudgets = state.budgets
          .map((_bud) => {
            const bud = { ..._bud };

            if (bud.id === id) {
              bud.name = response.data.name;
              return bud;
            }

            return bud;
          })
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            return -1;
          });

        resetShowEdit();
        setState({ ...state, budgets: newBudgets });
        setBudgets(newBudgets);
        document.querySelector('#search-category').value = '';
        errorMessage.current.classList.add('d-none');
        errorMessage.current.textContent = DEFAULT_ERROR_MESSAGE;
      }
    } catch (error) {
      if (error?.response) {
        errorMessage.current.textContent = error.response.data.name;
        errorMessage.current.classList.remove('d-none');
        errorMessage.current.previousSibling.classList.add('input-text-error');
        errorMessage.current.previousSibling.focus();
      }
    }
  }

  async function deleteCategory(budgetId) {
    const result = confirm('Are you sure want to delete this budget?');
    if (!result) {
      return;
    }

    try {
      const response = await budgetService.deleteBudgetCategory(budgetId);
      if (response.status === 204) {
        setTimeout(() => {
          setState({
            ...state,
            budgets: state.budgets.filter((bud) => bud.id !== budgetId),
          });
        }, 200);
      }
    } catch (error) {
      if (error?.response) {
        errorMessage.current.textContent = error.response.data.name;
        errorMessage.current.classList.remove('d-none');
      }
    }
  }

  return modalState.edit ? (
    <>
      <form
        onSubmit={(event) =>
          editCategory(event, budget.id, modalState.inputTextName)
        }
        method="post"
        action=""
        className="w-100 me-2"
      >
        <input
          type="text"
          name=""
          onChange={(event) =>
            setModalState({
              ...modalState,
              inputTextName: event.target.value,
            })
          }
          value={modalState.inputTextName}
          className="form-control form-control-sm"
          autoFocus
          placeholder="Name"
        />
        <span ref={errorMessage} className="text-danger small d-none">
          {DEFAULT_ERROR_MESSAGE}
        </span>
      </form>
      <div className="d-flex">
        <Tooltip text="Save" placement="bottom">
          <div
            onClick={(event) =>
              editCategory(event, budget.id, modalState.inputTextName)
            }
            role="button"
            className="btn-circle me-2"
          >
            <TbCheck className="fs-5" />
          </div>
        </Tooltip>
        <Tooltip text="Cancel" placement="bottom">
          <div
            onClick={() => setModalState({ ...modalState, edit: false })}
            role="button"
            className="btn-circle cancelEditBtn"
          >
            <TbArrowBackUp className="fs-5" />
          </div>
        </Tooltip>
      </div>
    </>
  ) : (
    <>
      <p
        title={budget.name}
        className="align-self-center fw-semibold text-truncate"
      >
        {budget.name}
      </p>
      <div className="d-flex">
        <Tooltip text="Edit" placement="bottom">
          <div
            // Show edit
            type="button"
            onClick={setEditModeHandler}
            role="button"
            className="btn-circle me-2"
          >
            <TbPencil className="fs-5" />
          </div>
        </Tooltip>
        <Tooltip text="Delete" placement="bottom">
          <div
            // Delete
            type="button"
            onClick={() => deleteCategory(budget.id)}
            role="button"
            className="btn-circle"
          >
            <CgTrash className="fs-5" />
          </div>
        </Tooltip>
      </div>
    </>
  );
}

ModalEdit.propTypes = {
  budget: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  setBudgets: PropTypes.func.isRequired,
  resetShowEdit: PropTypes.func.isRequired,
};

export default ModalEdit;
