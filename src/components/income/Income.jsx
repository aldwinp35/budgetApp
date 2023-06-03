import React from 'react';
import axios from 'axios';
import { Modal as BSModal } from 'bootstrap';
import Modal from '../Modal';
import Table from './Table';
import Loading from '../Loading';
import DatePicker from '../DatePicker';
import DoughnutChart from './DoughnutChart';
import BlankStateIncome from './BlankStateIncome';
import IncomeContext from '../../context/IncomeContext';
import { getOptionRequest } from '../../assets/lib/helpers';

function Income() {
  const modalInputDate = React.useRef(null);
  const incomeDate = React.useRef(null);
  const loaded = React.useRef(false);
  const config = getOptionRequest();
  const [state, setState] = React.useState({
    category: '',
    amount: '',
    editingIncome: '',
    showEditModal: false,
    incomeList: [],
    categoryList: [],
    date: '',
  });

  function clearModalInputs() {
    modalInputDate.current.datepicker.setDate({ clear: true });
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
    setState({
      ...state,
      showEditModal: false,
    });
    modal.hide();
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

  async function loadIncome() {
    const month = incomeDate.current.datepicker.getDate('mm');
    const year = incomeDate.current.datepicker.getDate('yyyy');

    try {
      const income = await axios.get(`/income/?month=${month}&year=${year}`, config);
      const categories = await loadIncomeCategories();
      setState({
        ...state,
        incomeList: income.data.results,
        categoryList: categories,
        category: categories[0].id,
      });
      loaded.current = true;
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  async function addIncome() {
    const income = {
      category: Number(state.category),
      amount: Number(state.amount),
      date: modalInputDate.current.datepicker.getDate('yyyy-mm-dd'),
    };

    try {
      const response = await axios.post('/income/', income, config);
      if (response.status === 201) {
        const newData = state.incomeList.push(response.data);
        setState({
          ...state,
          incomeList: newData,
        });
        clearModalInputs();
      }
    } catch (error) {
      if (error?.response) {
        console.log('Error: ', error.response.data);
      }
    }
  }

  async function editIncome(id) {
    const income = {
      id,
      category: Number(state.category),
      amount: Number(state.amount),
      date: modalInputDate.current.datepicker.getDate('yyyy-mm-dd'),
    };

    const response = await axios.put(`/income/${id}/update/`, income, config);
    if (response.status === 200) {
      const newIncomeData = state.incomeList.map((inc) => (inc.id === id ? response.data : inc));
      setState({ ...state, incomeList: newIncomeData });
      hideModal();
    }
  }

  function modalContent() {
    return (
      <form onSubmit={(event) => event.preventDefault()} className="position-relative mb-2">
        <div className="mb-2">
          <label htmlFor="categoryInput">Category</label>
          <select
            id="categoryInput"
            onChange={(event) => {
              setState({ ...state, category: event.target.value });
            }}
            value={state.category}
            className="form-select mt-1"
            disabled={!!state.showEditModal}
          >
            {state.categoryList.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="modalInputDate">Date</label>
          <DatePicker
            options={{
              autohide: true,
              language: 'en',
              format: 'dd-M-yyyy',
            }}
            refInput={modalInputDate}
          >
            <input id="modalInputDate" type="text" className="form-control mt-1" />
          </DatePicker>
        </div>
        <div className="mb-2">
          <label htmlFor="amountInput">Monthly Amount</label>
          <input
            id="amountInput"
            type="number"
            className="form-control mt-1"
            value={state.amount}
            step="0.50"
            onChange={(event) => setState({ ...state, amount: event.target.value })}
          />
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

  function mainContent() {
    if (!loaded.current) {
      return <Loading />;
    }

    if (state.incomeList.length === 0) {
      return <BlankStateIncome />;
    }

    return (
      <>
        <Table />
        <DoughnutChart />
      </>
    );
  }

  React.useEffect(() => {
    /* Load data on datepicker change event */
    incomeDate.current.datepicker.setDate(new Date());
  }, []);

  const values = React.useMemo(() => ({
    showModal,
    state,
    setState,
    modalInputDate,
    incomeDate,
  }));

  return (
    <IncomeContext.Provider value={values}>
      <div className="row mb-4 g-3">
        <div className="col-12">
          <div className="d-flex flex-column flex-sm-row justify-content-sm-between">
            <div className="mb-2 mb-sm-0">
              <button type="button" className="btn btn-primary" onClick={showModal}>
                New Income
              </button>
            </div>
            <div>
              <DatePicker
                options={{
                  pickLevel: '1',
                  autohide: true,
                  language: 'en',
                  format: 'MM yyyy',
                }}
                onChange={loadIncome}
                refInput={incomeDate}
              >
                <input id="incomeDate" type="text" className="form-control" placeholder="Date" />
              </DatePicker>
            </div>
          </div>
        </div>
        {mainContent()}
      </div>
      <Modal
        title={state.showEditModal ? 'Edit Income' : 'New Income'}
        content={modalContent()}
        cta={modalCTA()}
        closeCallback={clearModalInputs}
      />
    </IncomeContext.Provider>
  );
}

export default Income;
