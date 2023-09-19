import React, { useCallback, useContext } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
  Button,
  Spinner,
  FormFeedback,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';

import {
  EMPTY_INPUT_VALIDATION_MESSAGE,
  // handleErrorResponse,
} from '../../assets/lib/helpers';
import Context from '../../context/Context';

import { incomeService, alertService } from '../../api';

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

  const createCategory = useCallback((data) => {
    incomeService
      .createCategory(data)
      .then((response) => {
        if (response.status === 201) {
          setState((state) => ({
            ...state,
            categoryList: [...state.categoryList, response.data],
          }));
          toggleAddCategoryModal();
          alertService.info('Income category added');
        }
      })
      // .catch(handleErrorResponse);
      .catch((error) => {
        const errors = Object.keys(error.response.data).map(
          (x) => error.response.data[x]
        );
        setError('name', { message: errors });
      });
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
      onClosed={reset}
      autoFocus={false}
    >
      <ModalHeader className="border-0" toggle={toggleAddCategoryModal}>
        New category
      </ModalHeader>
      <div className="px-3">
        <p className="text-secondary fs-6 fw-normal">
          Add a new income category.
        </p>
      </div>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            <Controller
              control={control}
              name="name"
              rules={{
                required: EMPTY_INPUT_VALIDATION_MESSAGE,
                minLength: {
                  message: 'Minimum 3 characters required',
                  value: 3,
                },
                maxLength: {
                  message: 'Maximum characters exceeded',
                  value: 100,
                },
              }}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="ex: salary"
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
