/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Modal as BSModal } from 'bootstrap';
import Modal from './Modal';

function Dashboard() {
  const [name, setName] = React.useState('');

  function showModal() {
    const ele = document.querySelector('.modal');
    const instance = new BSModal(ele);
    instance.show();
  }

  function modalContent() {
    return (
      <div className="form-group">
        <label htmlFor="inputName">Name</label>
        <input
          id="inputName"
          type="text"
          value={name}
          className="form-control mt-2"
          placeholder="Ex: Jonh"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    );
  }

  function registerClient() {
    if (!name) {
      alert('Field Name is required.');
    } else {
      alert('The client was registered successfully.');
      setName('');
    }
  }

  function modalCta() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={registerClient}
      >
        Register
      </button>
    );
  }
  return (
    <div className="row">
      <div className="col-12">
        <h4 className="gray-1">Dashboard</h4>
        <div className="section">
          <button
            type="button"
            onClick={showModal}
            className="btn btn-primary me-2"
          >
            Open Modal
          </button>
          <button type="button" className="btn btn-secondary">
            Export data
          </button>
        </div>
      </div>
      <Modal
        title="Register Client"
        content={modalContent()}
        cta={modalCta()}
      />
    </div>
  );
}

export default Dashboard;
