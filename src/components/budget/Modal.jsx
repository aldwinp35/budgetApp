/* eslint-disable no-console */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Modal as BSModal } from 'bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import ModalEdit from './ModalEdit';
import SecondModal from './SecondModal';
import BudgetContext from '../../context/BudgetContext';
import budgetService from '../../api/budgetService';

function Modal() {
  const { state, modalManageCategory } = React.useContext(BudgetContext);
  const [budgets, setBudgets] = React.useState([]);
  const modalAddCategory = React.useRef();

  function scrollShadow() {
    const body = modalManageCategory.current.querySelector('.modal-body');
    const modalHeader = document.querySelector('.mod-header');
    const { scrollTop: scroll } = body;

    // Shadow top when scroll
    if (scroll > 0) modalHeader.classList.add('shadow-bottom');
    else modalHeader.classList.remove('shadow-bottom');
  }

  function resetShowEdit() {
    modalManageCategory.current
      .querySelector('.modal-body')
      .querySelectorAll('.cancelEditBtn')
      .forEach((el) => el.click());
  }

  function hideModal() {
    const bsModal = BSModal.getInstance(modalManageCategory.current);
    bsModal.hide();

    modalManageCategory.current.addEventListener('hidden.bs.modal', () => {
      resetShowEdit();
      setBudgets(state.budgets);
      modalManageCategory.current.querySelector('#search-category').value = '';
    });
  }

  function openSecondModal() {
    const bsModal = new BSModal(modalAddCategory.current, {
      backdrop: 'static',
      keyboard: false,
    });
    bsModal.show();
    hideModal();
    // Focus add budget input text
    modalAddCategory.current.addEventListener('shown.bs.modal', () => {
      modalAddCategory.current.querySelector('#category-name-text').focus();
    });
  }

  async function searchCategory(name) {
    try {
      const response = await budgetService.searchBudgetCategory(name);
      setBudgets(response.data.results);
    } catch (error) {
      if (error?.response)
        console.log('Search error: ', error.response?.data[0]);
    }
  }

  React.useEffect(() => {
    setBudgets(state.budgets);
  }, [state.budgets.length]);

  if (modalManageCategory.current) {
    const modalBody = modalManageCategory.current.querySelector('.modal-body');
    modalBody.addEventListener('scroll', scrollShadow);
  }

  return (
    <>
      <div className="modal fade" ref={modalManageCategory} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content p-3">
            <div className="mod-header pb-3">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="fs-5 fw-semibold">Manage Categories</div>
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
                onSubmit={(event) => event.preventDefault()}
                className="position-relative mb-2"
              >
                <input
                  id="search-category"
                  type="text"
                  onChange={(event) => searchCategory(event.target.value)}
                  name="name"
                  className="form-control pe-5"
                  placeholder="Search"
                />
              </form>
              <div className="d-flex justify-content-end">
                <button
                  onClick={openSecondModal}
                  type="button"
                  className="btn btn-sm btn-light px-3 border"
                >
                  <div className="d-flex align-items-center">
                    <AiOutlinePlus className="me-2" />
                    <span>New Category</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="modal-body p-0">
              <div className="mb-3">
                {budgets?.map((budget) => (
                  <div
                    key={budget.id}
                    className="d-flex justify-content-between p-1 border-category"
                  >
                    <ModalEdit
                      budget={budget}
                      setBudgets={setBudgets}
                      resetShowEdit={resetShowEdit}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end pt-3 mod-footer">
              <button
                type="button"
                className="btn btn-light border"
                onClick={hideModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <SecondModal modalAddCategory={modalAddCategory} />
    </>
  );
}

export default Modal;
