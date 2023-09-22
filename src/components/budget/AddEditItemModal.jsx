import React, { useEffect, useCallback, useContext } from 'react';
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
import {
  EMPTY_INPUT_VALIDATION_MESSAGE,
  handleErrorResponse,
} from '../../assets/lib/helpers';
import Context from '../../context/Context';

import { budgetService, alertService } from '../../api';

function AddEditItemModal() {
  const { filterDate, state, setState, toggleAddEditModal, budget } =
    useContext(Context);

    
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
        const response = await budgetService.createItem(data);
        if (response.status === 201) {
          setState((state) => ({
            ...state,
            itemList: [...state.itemList, response.data],
          }));
          toggleAddEditModal();
          alertService.info(`${budget.name} item created`);
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    },
    [state.itemList, state.modalAddEdit]
  );

  const updateItem = useCallback(
    async (id, data) => {
      try {
        const response = await budgetService.updateItem(id, data);
        if (response.status === 200) {
          setState((state) => ({
            ...state,
            itemList: state.itemList.map((x) => {
              if (x.id === id) return response.data;
              return x;
            }),
          }));
          toggleAddEditModal();
          alertService.info(`${budget.name} item updated`);
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    },
    [state.itemList, state.modalAddEdit]
  );

  const onSubmit = (data) => {
    return isAddMode ? createItem(data) : updateItem(state.itemToEdit.id, data);
  };

  const resetUpdateForm = () => {
    reset();
    setState((state) => ({ ...state, itemToEdit: null }));
  };

  useEffect(() => {
    if (!isAddMode) {
      setValue('item_category', state.itemToEdit.item_category);
      setValue('date', state.itemToEdit.date);
      setValue('amount', state.itemToEdit.amount);
    } else {
      setValue('item_category', '');
      setValue('date', '');
      setValue('amount', '');
    }
  }, [isAddMode]);

  return (
    <Modal
      isOpen={state.modalAddEdit}
      toggle={toggleAddEditModal}
      backdrop="static"
      keyboard={false}
      centered
      fullscreen="sm"
      onClosed={isAddMode ? reset : resetUpdateForm}
    >
      <ModalHeader className="border-0" toggle={toggleAddEditModal}>
        {isAddMode
          ? `New ${budget.name.toLowerCase()} item`
          : `Edit ${budget.name.toLowerCase()} item`}
      </ModalHeader>
      <div className="px-3">
        <p className="text-secondary fs-6 fw-normal mb-3">
          Add items for this budget
        </p>
      </div>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label for="input-select-category">
              Item type <span className="text-danger me-2">*</span>
            </Label>
            <Controller
              name="item_category"
              rules={{ required: EMPTY_INPUT_VALIDATION_MESSAGE }}
              control={control}
              render={({ field }) => (
                <Input
                  id="input-select-category"
                  type="select"
                  disabled={!isAddMode}
                  invalid={errors?.item_category ? true : false}
                  {...field}
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {state.itemCategoryList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.item_category?.message}</FormFeedback>
          </FormGroup>

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
                        disabled={!isAddMode}
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
                      const isoDate = e.detail.date.toISOString().split('T')[0];
                      setValue('date', isoDate);
                      clearErrors('date');
                    }}
                  />
                );
              }}
            />
            <FormFeedback>{errors.date?.message}</FormFeedback>
          </FormGroup>

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
            {isAddMode ? 'Add item' : 'Save item'}
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
//   itemCategoryList: PropTypes.arrayOf(Object).isRequired,
//   setItemCategoryList: PropTypes.func.isRequired,
//   itemToEdit: PropTypes.object,
//   setItemToEdit: PropTypes.func,
// };

// AddEdit.defaultProps = {
//   itemToEdit: null,
//   setItemToEdit: null,
// };

export default AddEditItemModal;
