/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React from 'react';
import axios from 'axios';
import { Modal as BSModal } from 'bootstrap';
import Modal from '../Modal';
import Table from './Table';
import DatePicker from '../DatePicker';
import DoughnutChart from './DoughnutChart';
import BlankStateIncome from './BlankStateIncome';
import IncomeContext from '../../context/IncomeContext';
import { getOptionRequest } from '../../assets/lib/helpers';

function Income() {
  const datepickerRef = React.useRef(null);
  const config = getOptionRequest();
  const [state, setState] = React.useState({
    category: '',
    amount: '',
    editingIncome: '',
    showEditModal: false,
    incomeList: [],
    categoryList: [],
  });

  function clearModalInput() {
    datepickerRef.current.value = '';
    setState({
      ...state,
      category: state.categoryList[0].id,
      amount: '',
      showEditModal: false,
    });
  }

  function showModal() {
    const modalEl = document.querySelector('.modal');
    const modal = new BSModal(modalEl, {
      backdrop: 'static',
    });
    modal.show();
  }

  function hideModal() {
    const modalEl = document.querySelector('.modal');
    const modal = BSModal.getInstance(modalEl);
    modal.hide();
  }

  async function loadIncome() {
    let data;
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    try {
      const response = await axios.get(`/income/?month=${month}&year=${year}`, config);
      data = response.data.results;
    } catch (error) {
      console.error('Error: ', error);
    }

    return data;
  }

  async function loadIncomeCategories() {
    let data;
    try {
      const response = await axios.get('/income-category/', config);
      data = response.data.results;
    } catch (error) {
      console.error('Error: ', error);
    }

    return data;
  }

  async function addIncome() {
    const income = {
      category: Number(state.category),
      amount: Number(state.amount),
      date: datepickerRef.current.datepicker.getDate('yyyy-mm-dd'),
    };

    try {
      const response = await axios.post('/income/', income, config);
      if (response.status === 201) {
        const newData = state.incomeList.push(response.data);
        setState({
          ...state,
          incomeList: newData,
        });
        clearModalInput();
      }
    } catch (error) {
      if (error?.response) {
        console.log('Error: ', error.response.data);
      }
    }
  }

  async function editIncome(id) {
    const income = {
      category: Number(state.category),
      amount: Number(state.amount),
      date: datepickerRef.current.datepicker.getDate('yyyy-mm-dd'),
    };

    const response = await axios.put(`/income/${id}/update/`, income, config);
    if (response.status === 200) {
      const newIncomeData = state.incomeList.map((inc) => (inc.id === id ? response.data : inc));
      setState({ ...state, incomeList: newIncomeData });
      hideModal();
    }
  }

  async function removeIncome(id) {
    const result = confirm('Are you sure want to delete this income?');
    if (!result) {
      return;
    }

    try {
      const response = await axios.delete(`/income/${id}/delete/`, config);
      if (response.status === 204) {
        setState({
          ...state,
          incomeList: state.incomeList.filter((income) => income.id !== id),
        });
      }
    } catch (error) {
      if (error?.response) {
        console.log('Error: ', error.response.data);
      }
    }
  }

  function modalContent() {
    return (
      <form onSubmit={(event) => event.preventDefault()} className="position-relative mb-2">
        <div className="form-floating">
          <select
            onChange={(event) => {
              setState({ ...state, category: event.target.value });
            }}
            value={state.category}
            className="form-select mb-2"
          >
            {state.categoryList.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label>Category</label>
        </div>
        <div className="form-floating">
          <DatePicker
            options={{
              autohide: true,
              language: 'en',
              format: 'dd-M-yyyy',
            }}
            refInput={datepickerRef}
          >
            <input id="dateInput" type="text" className="form-control mb-2" placeholder="Date" />
          </DatePicker>
          <label>Date</label>
        </div>
        <div className="form-floating">
          <input
            type="number"
            className="form-control mb-2"
            value={state.amount}
            step="0.50"
            onChange={(event) => setState({ ...state, amount: event.target.value })}
            placeholder="Monthly Amount"
          />
          <label>Amount</label>
        </div>
      </form>
    );
  }

  function modalCTA() {
    if (state.showEditModal) {
      return (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => editIncome(state.editingIncome)}
        >
          Edit Income
        </button>
      );
    }

    return (
      <button type="button" className="btn btn-primary" onClick={addIncome}>
        Add Income
      </button>
    );
  }

  React.useEffect(() => {
    (async () => {
      const income = await loadIncome();
      const categories = await loadIncomeCategories();
      setState({
        ...state,
        incomeList: income,
        categoryList: categories,
        category: categories[0].id,
      });
    })();
  }, []);

  const values = React.useMemo(() => ({
    showModal,
    state,
    setState,
    removeIncome,
    datepickerRef,
  }));

  return (
    <IncomeContext.Provider value={values}>
      <div className="row mb-4 g-3">
        <div className="col-12">
          <h4 className="gray-1 m-0">Income</h4>
        </div>
        {state.incomeList.length > 0 ? (
          <>
            <Table />
            <DoughnutChart />
          </>
        ) : (
          <BlankStateIncome />
        )}
      </div>
      <Modal
        title={state.showEditModal ? 'Edit Income' : 'New Income'}
        content={modalContent()}
        cta={modalCTA()}
        closeCallback={clearModalInput}
      />
    </IncomeContext.Provider>
  );
}

export default Income;
