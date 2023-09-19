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

import { incomeService, alertService } from '../../api';

function AddEditModal() {
  const {
    filterDate,
    state,
    setState,
    toggleAddEditModal,
    toggleAddCategoryModal,
  } = useContext(Context);

  const isAddMode = !state.incomeToEdit;

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
      category: '',
      date: '',
      amount: '',
    },
  });

  const createIncome = useCallback(
    async (data) => {
      try {
        const response = await incomeService.create(data);
        if (response.status === 201) {
          setState((state) => ({
            ...state,
            incomeList: [...state.incomeList, response.data],
          }));
          toggleAddEditModal();
          alertService.info('Income created');
        }
      } catch (error) {
        if (error.response.status === 400) {
          const errors = Object.keys(error.response.data).map(
            (x) => error.response.data[x]
          );
          setError('category', { message: errors });
        } else {
          handleErrorResponse(error);
        }
      }
    },
    [state.incomeList, state.modalAddEdit]
  );

  const updateIncome = useCallback(
    async (id, data) => {
      try {
        const response = await incomeService.update(id, data);

        if (response.status === 200) {
          const oldDate = state.incomeToEdit.date.slice(0, 7);
          const newDate = response.data.date.slice(0, 7);
          if (oldDate === newDate) {
            // When date is updated in the same month and year as the previous date
            // Find and update the income state
            setState((state) => ({
              ...state,
              incomeList: state.incomeList.map((x) => {
                if (x.id === id) return response.data;
                return x;
              }),
            }));

            alertService.info('Income updated.');
          } else {
            // // Remove income from state, so the user has to change the date
            // //  to the date where the income was updated
            // setState((state) => ({
            //   ...state,
            //   incomeList: state.incomeList.filter(
            //     (x) => x.id !== response.data.id
            //   ),
            // }));
            // // Show where the updated income was moved
            // const updatedDate = new Date(response.data.date).toLocaleString(
            //   'en-US',
            //   {
            //     month: 'long',
            //     year: 'numeric',
            //   }
            // );
            // alertService.info(
            //   `Income updated. The income was moved to <strong>${updatedDate}</strong>`,
            //   { autoClose: false }
            // );
          }

          // Close modal
          toggleAddEditModal();
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    },
    [state.incomeList, state.modalAddEdit]
  );

  const onSubmit = (data) => {
    return isAddMode
      ? createIncome(data)
      : updateIncome(state.incomeToEdit.id, data);
  };

  const resetUpdateForm = () => {
    reset();
    setState((state) => ({ ...state, incomeToEdit: null }));
  };

  useEffect(() => {
    if (!isAddMode) {
      setValue('category', state.incomeToEdit.category);
      setValue('date', state.incomeToEdit.date);
      setValue('amount', state.incomeToEdit.amount);
    } else {
      setValue('category', '');
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
        {isAddMode ? 'New income' : 'Edit income'}
      </ModalHeader>
      <div className="px-3">
        <p className="text-secondary fs-6 fw-normal mb-3">
          Record your monthly income and organize them by categories.
        </p>
      </div>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label for="input-select-category">
              Category <span className="text-danger me-2">*</span>
            </Label>
            <Controller
              name="category"
              rules={{ required: EMPTY_INPUT_VALIDATION_MESSAGE }}
              control={control}
              render={({ field }) => (
                <Input
                  id="input-select-category"
                  type="select"
                  disabled={!isAddMode}
                  invalid={errors?.category ? true : false}
                  {...field}
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {state.categoryList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.category?.message}</FormFeedback>
            {isAddMode ? (
              <div className="mt-1">
                <div
                  tabIndex="0"
                  role="button"
                  onKeyUp={(e) =>
                    e.key === ' ' ? toggleAddCategoryModal() : null
                  }
                  onClick={toggleAddCategoryModal}
                  className="d-inline small text-primary"
                >
                  New category
                </div>
              </div>
            ) : null}
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
                        invalid={errors?.date ? true : false}
                        disabled={!isAddMode}
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
              Amount <span className="text-danger">*</span>
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
            {isAddMode ? 'Add income' : 'Save income'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

// AddEdit.propTypes = {
//   modal: PropTypes.bool.isRequired,
//   toggleModal: PropTypes.func.isRequired,
//   incomeList: PropTypes.arrayOf(Object).isRequired,
//   setIncomeList: PropTypes.func.isRequired,
//   categoryList: PropTypes.arrayOf(Object).isRequired,
//   setCategoryList: PropTypes.func.isRequired,
//   incomeToEdit: PropTypes.object,
//   setIncomeToEdit: PropTypes.func,
// };

// AddEdit.defaultProps = {
//   incomeToEdit: null,
//   setIncomeToEdit: null,
// };

export default AddEditModal;
