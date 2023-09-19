import React, { useCallback, useContext } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Spinner,
  FormFeedback,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';

import Context from '../../context/Context';
import {
  EMPTY_INPUT_VALIDATION_MESSAGE,
  // handleErrorResponse,
} from '../../assets/lib/helpers';

import { budgetService, alertService } from '../../api';

function AddCategoryModal() {
  const { state, setState, toggleAddCategoryModal } = useContext(Context);

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const createCategory = useCallback(async ({ name }) => {
    try {
      const response = await budgetService.create({
        name,
      });

      if (response.status === 201) {
        setState((state) => ({
          ...state,
          budgets: [...state.budgets, response.data],
        }));
        alertService.info('Category added');
        toggleAddCategoryModal();
      }
    } catch (error) {
      // handleErrorResponse(error);
      const errors = Object.keys(error.response.data).map(
        (x) => error.response.data[x]
      );
      setError('name', { message: errors });
    }
  }, []);

  const onSubmit = (data) => {
    createCategory(data);
  };

  return (
    <Modal
      isOpen={state.modalAddCategory}
      toggle={toggleAddCategoryModal}
      centered
      backdrop="static"
      keyboard={false}
      autoFocus={false}
      onClosed={reset}
    >
      <ModalHeader className="border-0" toggle={toggleAddCategoryModal}>
        New category
      </ModalHeader>
      <div className="px-3">
        <p className="text-secondary fs-6 fw-normal">
          Add a new budget category.
        </p>
      </div>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            <Controller
              name="name"
              rules={{ required: EMPTY_INPUT_VALIDATION_MESSAGE }}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="ex: groceries"
                  invalid={errors?.name ? true : false}
                  autoFocus
                  {...field}
                />
              )}
            />
            <FormFeedback>{errors.name?.message}</FormFeedback>
          </>
        </Form>
      </ModalBody>
      <ModalFooter className="border-0">
        <div className="w-100 d-flex flex-column flex-sm-row justify-content-sm-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner size="sm">Loading...</Spinner>}
            Add category
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default AddCategoryModal;
