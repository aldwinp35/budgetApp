import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  Button,
  Input,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
} from 'reactstrap';
import ShowOrEditCategories from './ShowOrEditCategories';
import Context from '../../context/Context';

function ManageCategoryModal() {
  const [filterText, setFilterText] = useState('');
  const [filteredData, setfFilteredData] = useState(null);
  const { state, toggleManageCategoryModal, toggleAddCategoryModal } =
    useContext(Context);

  // Filter categories
  useEffect(() => {
    const result =
      filterText.length > 0
        ? state.budgets?.filter(({ name }) =>
            name.toLowerCase().includes(filterText.toLowerCase())
          )
        : state.budgets;
    setfFilteredData(result);
  }, [filterText, state.budgets]);

  return (
    <Modal
      isOpen={state.modalManageCategory}
      toggle={toggleManageCategoryModal}
      centered
      scrollable
      backdrop="static"
      keyboard={false}
      fullscreen="sm"
      onClosed={() => setFilterText('')}
    >
      <ModalHeader className="border-0" toggle={toggleManageCategoryModal}>
        Budget categories
      </ModalHeader>
      <div className="body-header px-3 border-bottom">
        <p className="text-secondary fs-6 fw-normal mb-3">
          Add or delete categories.
        </p>
        <FormGroup>
          <Input
            id="input-search-category"
            type="text"
            placeholder="Search"
            spellCheck={false}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <div className="w-100 d-flex flex-column flex-sm-row justify-content-sm-end mt-3">
            <Button
              onClick={toggleAddCategoryModal}
              color="primary"
              // className="border"
            >
              New category
            </Button>
          </div>
        </FormGroup>
      </div>
      <ModalBody className="mb-3">
        {/* Category list */}
        <div
          style={{
            minHeight: '250px',
            maxHeight: '250px',
          }}
        >
          {filteredData?.length > 0 ? (
            filteredData.map(({ id, name }) => (
              <div key={id}>
                <ShowOrEditCategories id={id} category={name} />
              </div>
            ))
          ) : (
            <div className="text-center text-secondary fst-italic">
              No categories.
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="w-100 d-flex flex-column flex-sm-row justify-content-sm-end">
          <Button color="light" onClick={toggleManageCategoryModal}>
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ManageCategoryModal;
