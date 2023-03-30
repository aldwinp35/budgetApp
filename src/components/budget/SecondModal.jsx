/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable operator-linebreak */

import React from 'react';
import { Modal as BSModal } from 'bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import BudgetContext from '../../context/BudgetContext';
import budgetService from '../../api/budgetService';

function SecondModal({ modalAddCategory }) {
  const { state, setState, modalManageCategory } =
    React.useContext(BudgetContext);
  const [modalText, setModalText] = React.useState('');
  const errorMessage = React.useRef();
  const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

  function hideModal() {
    const bsModal = BSModal.getInstance(modalAddCategory.current);
    const bsModalFirst = BSModal.getInstance(modalManageCategory.current);

    setModalText('');
    errorMessage.current.textContent = DEFAULT_ERROR_MESSAGE;
    errorMessage.current.classList.add('d-none');
    modalAddCategory.current
      .querySelector('#category-name-text')
      .classList.remove('input-text-error');

    bsModal.hide();
    bsModalFirst.show();
  }

  async function addCategory(event) {
    event.preventDefault();

    try {
      const response = await budgetService.addBudgetCategory({
        name: modalText,
      });

      if (response.data) {
        const newBudgets = [...state.budgets, response.data].sort((a, b) => {
          if (a.name > b.name) return 1;
          return -1;
        });

        setState({ ...state, budgets: newBudgets });
        hideModal();
      }
    } catch (error) {
      if (error.response?.data) {
        errorMessage.current.textContent = error.response.data.name;
        errorMessage.current.classList.remove('d-none');
        modalAddCategory.current
          .querySelector('#category-name-text')
          .classList.add('input-text-error');
        modalAddCategory.current.querySelector('#category-name-text').focus();
      }
    }
  }

  return (
    <div className="modal fade" ref={modalAddCategory} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content p-3">
          <div className="">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-5 fw-semibold">New Category</div>
              <div
                role="button"
                className="btn-circle btn-close"
                onClick={hideModal}
                aria-label="Close"
              ></div>
            </div>
            <form
              action="http://127.0.0.1:8000/budget/"
              method="post"
              onSubmit={(event) => addCategory(event)}
              className="position-relative mb-2"
            >
              <input
                id="category-name-text"
                type="text"
                onChange={(event) => setModalText(event.target.value)}
                name="name"
                value={modalText}
                className="form-control pe-5"
                placeholder="Name"
              />
              {modalText ? (
                <div>
                  <Tooltip text="Add Category" placement="bottom">
                    <div
                      onClick={(event) => addCategory(event)}
                      className="btn-circle-fill"
                      role="button"
                      style={{ position: 'absolute', top: '3px', right: '5px' }}
                    >
                      <AiOutlinePlus className="fs-5" />
                    </div>
                  </Tooltip>
                </div>
              ) : null}
            </form>
            <div className="text-danger d-none" ref={errorMessage}>
              {DEFAULT_ERROR_MESSAGE}
            </div>
          </div>
          <div className="modal-body p-0">
            <div className="mb-3"></div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={(event) => addCategory(event)}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SecondModal.propTypes = {
  modalAddCategory: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLDivElement),
  }).isRequired,
};

export default SecondModal;
