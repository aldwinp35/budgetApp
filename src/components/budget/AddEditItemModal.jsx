import React, { useState, useEffect, useCallback, useContext } from 'react';
// import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  Input,
  Button,
  FormGroup,
  FormFeedback,
  Spinner,
} from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import DatepickerComponent from '../util/DatepickerComponent';
import { CustomSelect } from '../util/CustomSelect';

import {
  EMPTY_INPUT_VALIDATION_MESSAGE,
  handleErrorResponse,
} from '../../assets/lib/helpers';
import Context from '../../context/Context';

import { budgetService, alertService } from '../../api';

function AddEditItemModal({
  budget,
  itemList,
  setItemList,
  categoryList,
  setCategoryList,
  modalAddEdit,
  toggleAddEditModal,
}) {
  const { filterDate, state, setState } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const isAddMode = !state.itemToEdit;

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      item_category: '',
      date: '',
      amount: '',
    },
  });

  const createItem = useCallback(
    async (data) => {
      try {
        data.item_category = data.item_category.id;
        const response = await budgetService.createItem(data);
        if (response.status === 201) {
          const newItems = [...itemList, response.data];
          setItemList(newItems);
          setState((state) => ({
            ...state,
            budgetList: state.budgetList.map((b) => {
              if (b.id === budget.id) b.items = newItems;
              return b;
            }),
          }));
          toggleAddEditModal();
          alertService.info(`${budget.name} item created`);
        }
      } catch (error) {
        if (error.response.status === 400) {
          const errors = Object.keys(error.response.data).map(
            (x) => error.response.data[x]
          );
          setError('item_category', { message: errors });
        } else {
          handleErrorResponse(error);
        }
      }
    },
    [itemList, modalAddEdit]
  );

  const updateItem = useCallback(
    async (id, data) => {
      try {
        data.item_category = data.item_category.id;
        const response = await budgetService.updateItem(id, data);
        if (response.status === 200) {
          const newItems = itemList.map((i) =>
            i.id === id ? response.data : i
          );
          setItemList(newItems);
          setState((state) => ({
            ...state,
            budgetList: state.budgetList.map((b) => {
              if (b.id === budget.id) b.items = newItems;
              return b;
            }),
          }));
          toggleAddEditModal();
          alertService.info(`${budget.name} item updated`);
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    },
    [itemList, modalAddEdit]
  );

  const onSubmit = (data) => {
    return isAddMode ? createItem(data) : updateItem(state.itemToEdit.id, data);
  };

  const resetUpdateForm = () => {
    reset();
    setState((state) => ({ ...state, itemToEdit: null }));
  };

  const handleCreate = useCallback(async (inputValue) => {
    setIsLoading(true);
    const category = { budget_category: budget.id, name: inputValue };

    try {
      const response = await budgetService.createItemCategory(category);
      const newOption = {
        id: response.data.id,
        label: response.data.name,
        value: response.data.name,
      };

      setIsLoading(false);
      setCategoryList((prev) => [...prev, response.data]);
      setValue('item_category', newOption);
    } catch (error) {
      if (error.response.status === 400) {
        const errors = Object.keys(error.response.data).map(
          (x) => error.response.data[x]
        );
        setError('item_category', { message: errors });
      } else {
        handleErrorResponse(error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAddMode) {
      setValue('date', state.itemToEdit.date);
      setValue('amount', state.itemToEdit.amount);
      setValue('item_category', {
        id: state.itemToEdit.id,
        label: state.itemToEdit.name,
        value: state.itemToEdit.name,
      });
    } else {
      setValue('date', '');
      setValue('amount', '');
      setValue('item_category', '');
    }
  }, [isAddMode]);

  return (
    <Modal
      isOpen={modalAddEdit}
      toggle={toggleAddEditModal}
      backdrop="static"
      keyboard={false}
      centered
      fullscreen="sm"
      onClosed={isAddMode ? reset : resetUpdateForm}
    >
      <ModalHeader className="border-0" toggle={toggleAddEditModal}>
        {isAddMode ? (
          <span className="fw-normal">
            New <span className="fw-semibold">{budget.name.toLowerCase()}</span>{' '}
            item
          </span>
        ) : (
          <span className="fw-normal">
            Edit{' '}
            <span className="fw-semibold">
              {state.itemToEdit.name.toLowerCase()}
            </span>{' '}
            in {budget.name.toLowerCase()}
          </span>
        )}
      </ModalHeader>
      {/* <div className="px-3">
        <p className="text-secondary fs-6 fw-normal mb-3">
          Add items for this budget
        </p>
      </div> */}
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {isAddMode ? (
            <FormGroup>
              <Label for="input-select-category">
                Item category <span className="text-danger me-2">*</span>
              </Label>
              <Controller
                name="item_category"
                rules={{ required: EMPTY_INPUT_VALIDATION_MESSAGE }}
                control={control}
                render={() => (
                  <CustomSelect
                    isClearable
                    inputId="input-select-category"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onChange={(value) => {
                      if (!value) {
                        setValue('item_category', '');
                        setError('item_category', {
                          message: 'This field is required',
                        });
                        return;
                      }

                      setValue('item_category', value);
                      clearErrors('item_category');
                    }}
                    onCreateOption={handleCreate}
                    options={categoryList.map(({ id, name }) => ({
                      id,
                      label: name,
                      value: name,
                    }))}
                    invalid={errors?.item_category ? true : false}
                    value={getValues('item_category')}
                  />
                )}
              />
              <small className="text-danger">
                {errors.item_category?.message}
              </small>
            </FormGroup>
          ) : null}

          {isAddMode ? (
            <FormGroup>
              <Label for="input-text-date">
                Date <span className="text-danger">*</span>
              </Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: EMPTY_INPUT_VALIDATION_MESSAGE }}
                render={() => {
                  return (
                    <DatepickerComponent
                      selected={getValues('date')}
                      placeholder="mm/dd/yyyy"
                      defaultViewDate={filterDate.current}
                      customInput={
                        <Input
                          id="input-text-date"
                          invalid={errors?.date ? true : false}
                        />
                      }
                      onChangeDate={(e) => {
                        // Make sure this field is not blank
                        if (!e.detail.date) {
                          setValue('date', '');
                          setError('date', {
                            message: EMPTY_INPUT_VALIDATION_MESSAGE,
                          });
                          return;
                        }

                        // Set field and clear error
                        const isoDate = e.detail.date
                          .toISOString()
                          .split('T')[0];
                        setValue('date', isoDate);
                        clearErrors('date');
                      }}
                    />
                  );
                }}
              />
              <FormFeedback>{errors.date?.message}</FormFeedback>
            </FormGroup>
          ) : null}

          <FormGroup>
            <Label for="input-text-amount">
              Planned amount <span className="text-danger">*</span>
            </Label>
            <Controller
              name="amount"
              rules={{
                required: EMPTY_INPUT_VALIDATION_MESSAGE,
              }}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <NumericFormat
                    id="input-text-amount"
                    placeholder="ex: $100"
                    prefix="$"
                    value={getValues('amount')}
                    onValueChange={(v) => onChange(v.floatValue)}
                    thousandSeparator
                    allowNegative={false}
                    customInput={Input}
                    invalid={errors?.amount ? true : false}
                  />
                );
              }}
            />
            <FormFeedback>{errors.amount?.message}</FormFeedback>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="border-0">
        <div className="w-100 d-flex gap-3 flex-column flex-sm-row justify-content-between align-items-sm-center">
          <div className="fst-italic ">
            <span className="text-danger fw-bold">*</span> Required fields
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner size="sm">Loading...</Spinner>}
            {isAddMode ? 'Add item' : 'Save change'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

// AddEdit.propTypes = {
//   modal: PropTypes.bool.isRequired,
//   toggleModal: PropTypes.func.isRequired,
//   itemList: PropTypes.arrayOf(Object).isRequired,
//   setItemList: PropTypes.func.isRequired,
//   categoryList: PropTypes.arrayOf(Object).isRequired,
//   setItemCategoryList: PropTypes.func.isRequired,
//   itemToEdit: PropTypes.object,
//   setItemToEdit: PropTypes.func,
// };

// AddEdit.defaultProps = {
//   itemToEdit: null,
//   setItemToEdit: null,
// };

export default AddEditItemModal;
