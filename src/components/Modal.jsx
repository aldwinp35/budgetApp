/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal as BSModal } from 'bootstrap';

function Modal({ title, content, cta, closeCallback }) {
  function close() {
    const modalEl = document.querySelector('.modal');
    const modal = BSModal.getInstance(modalEl);
    modal.hide();
    modalEl.addEventListener('hidden.bs.modal', () => {
      if (closeCallback != null) closeCallback();
      //   modal.dispose();
    });
  }

  function closeWithSpace(event) {
    if (event.keyCode === 32) {
      close();
    }
  }

  return (
    <div className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="mod-header mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div className="fs-5 fw-semibold">{title}</div>
              <div
                role="button"
                className="btn-circle btn-close"
                onClick={close}
                aria-label="Close"
                tabIndex={0}
                onKeyUp={closeWithSpace}
              />
            </div>
          </div>
          <div className="mod-body mb-4">{content}</div>
          <div className="mod-footer">
            <div className="d-flex justify-content-end">{cta}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.instanceOf(Object).isRequired,
  cta: PropTypes.instanceOf(Object).isRequired,
  closeCallback: PropTypes.func,
};

Modal.defaultProps = {
  closeCallback: null,
};

export default Modal;
