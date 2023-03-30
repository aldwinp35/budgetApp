/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react';

function EditItemNotUsing({ item }) {
  const [state, setState] = React.useState({
    name: item.name,
    planned: item.planned,
  });

  const editItem = () => {
    console.log('editing item..');
  };

  return (
    <div className="col-12">
      <form className="" method="put" onSubmit={editItem}>
        <div className="d-lg-flex">
          <div className="col-12 col-lg-5 mb-2 mb-lg-0 me-lg-2">
            <input
              onChange={(event) =>
                setState({ ...state, name: event.target.value })
              }
              type="text"
              value={state.name}
              className="form-control"
              placeholder="Item name"
              name="item"
            />
          </div>
          <div className="col-12 col-lg-5">
            <input
              onChange={(event) =>
                setState({ ...state, planned: event.target.value })
              }
              type="number"
              value={state.planned}
              step="0.50"
              className="form-control"
              placeholder="Planned amount"
              name="planned"
            />
          </div>
          <div className="col-12 col-lg-2">
            <div className="d-flex justify-content-around">
              <button
                type="button"
                onClick={editItem}
                className="btn btn-link
               text-decoration-none fw-semibold text-truncate"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-link
               text-decoration-none fw-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditItemNotUsing;
