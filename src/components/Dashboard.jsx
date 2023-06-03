import React from 'react';
import { Modal as BSModal } from 'bootstrap';
import axios from 'axios';
import Modal from './Modal';
import Datatable from './dataTable/DataTable';
import { getOptionRequest } from '../assets/lib/helpers';
import data from '../api/mock_data.json';

async function getApiData() {
  const config = getOptionRequest();
  const response = await axios.get('/budget-item/', config);
  return response.data.results;
}

function editRow(id) {
  console.log('edit id: ', id);
}

function deleteRow(id) {
  console.log('delete id: ', id);
}

// function editRowButton(id) {
//   function action() {
//     console.log('clicked id: ', id);
//   }
//   return (
//     <button onClick={action} type="button" className="btn btn-sm btn-info">
//       Edit
//     </button>
//   );
// }

// function deleteRowButton(id) {
//   function action() {
//     console.log('clicked id: ', id);
//   }
//   return (
//     <button onClick={action} type="button" className="btn btn-sm btn-danger">
//       Delete
//     </button>
//   );
// }

function Dashboard() {
  console.log('dasboard');

  //   function showModal() {
  //     const ele = document.querySelector('.modal');
  //     const instance = new BSModal(ele);
  //     instance.show();
  //   }

  //   function modalContent() {
  //     return (
  //       <div>
  //         <label htmlFor="inputName">Name</label>
  //         <input
  //           id="inputName"
  //           type="text"
  //           value={state.name}
  //           className="form-control mt-2"
  //           placeholder="Ex: Jonh"
  //           onChange={(e) => setState({ ...state, name: e.target.value })}
  //         />
  //       </div>
  //     );
  //   }

  //   function registerClient() {
  //     if (!state.name) {
  //       alert('Field Name is required.');
  //     } else {
  //       alert('The client was registered successfully.');
  //       setState({ ...state, name: '' });
  //     }
  //   }

  //   function modalCta() {
  //     return (
  //       <button type="button" className="btn btn-primary" onClick={registerClient}>
  //         Register
  //       </button>
  //     );
  //   }

  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="section">
          <Datatable
            options={{
              title: 'Mock Data',
              // title: 'Budget Item',
              data,
              rowActions: {
                edit: editRow,
                delete: deleteRow,
              },
              formats: {
                money: ['amount', 'spent', 'difference'],
                date: ['date'],
              },
              // exclude: ['category', 'updated_at', 'created_at'],
              // fields: ['name', 'date', 'amount', 'spent', 'difference'],
              // fields: ['first_name', 'last_name', 'email', 'ip_address'],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
