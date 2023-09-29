import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
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

import BudgetType from '../../types/BudgetType';
import { OptionList } from './OptionList';
import DatepickerComponent from '../util/DatepickerComponent';
import { CustomSelect } from '../util/CustomSelect';
import Context from '../../context/Context';
import { budgetService, alertService } from '../../api';
import {
  EMPTY_INPUT_VALIDATION_MESSAGE,
  handleErrorResponse,
} from '../../assets/lib/helpers';

function AddEditItemModal({
  budget,
  itemList,
  setItemList,
  modalAddEdit,
  toggleAddEditModal,
}) {
  const { filterDate, state, setState } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState(null);
  const itemListRef = useRef(itemList);
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

  const deleteCategory = useCallback(async (e, id) => {
    e.stopPropagation();
    e.preventDefault();

    const result = confirm(
      'Are you sure you want to delete this item category?'
    );
    if (!result) return;

    const response = await budgetService.removeItemCategory(id);
    if (response.status === 204) {
      // Remove category from categoryList
      setCategoryList((prev) => prev.filter((x) => x.id !== id));
      // Remove item that has categoryList
      setItemList((prev) => prev.filter((x) => x.item_category !== id));
    }
  }, []);

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

  // Get item categories
  useEffect(() => {
    budgetService.getItemCategoryByBudgetId(budget.id).then((res) => {
      if (res.status === 200) {
        setCategoryList(res.data.results);
      }
    });
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

  useEffect(() => {
    // Update balance when items are changed
    if (itemList !== itemListRef.current) {
      budgetService
        .getBalance(
          filterDate.current.getMonth() + 1,
          filterDate.current.getFullYear()
        )
        .then((res) => {
          if (res.status === 200) {
            setState((st) => ({
              ...st,
              planned: res.data.planned,
            }));
          }
        })
        .catch((error) => console.error('Error: ', error));
    }
  }, [itemList]);

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
                    onCreateOption={handleCreate}
                    invalid={errors?.item_category ? true : false}
                    value={getValues('item_category')}
                    options={categoryList.map(({ id, name }) => ({
                      id,
                      label: name,
                      value: name,
                    }))}
                    onChange={(value) => {
                      if (!value) {
                        setValue('item_category', '');
                        setError('item_category', {
                          message: EMPTY_INPUT_VALIDATION_MESSAGE,
                        });
                        return;
                      }

                      setValue('item_category', value);
                      clearErrors('item_category');
                    }}
                    components={{ Option: OptionList }}
                    onDelete={deleteCategory}
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

AddEditItemModal.propTypes = {
  budget: PropTypes.shape({ BudgetType }.propTypes).isRequired,
  itemList: PropTypes.arrayOf(Object).isRequired,
  setItemList: PropTypes.func.isRequired,
  modalAddEdit: PropTypes.bool.isRequired,
  toggleAddEditModal: PropTypes.func.isRequired,
};

// AddEditItemModal.defaultProps = {
//   ...
// };

export default AddEditItemModal;
