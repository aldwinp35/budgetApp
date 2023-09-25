import React, { useState, useCallback, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TbCheck, TbArrowBackUp, TbPencil } from 'react-icons/tb';
import { CgTrash } from 'react-icons/cg';
import { Input, Form, FormGroup, FormFeedback } from 'reactstrap';

import ButtonCircle from '../util/ButtonCircle';
import Tooltip from '../util/Tooltip';
import Context from '../../context/Context';
import {
  EMPTY_INPUT_VALIDATION_MESSAGE,
  handleErrorResponse,
} from '../../assets/lib/helpers';

import { budgetService, alertService } from '../../api';

function ShowOrEditCategories({ id, category }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setState } = useContext(Context);

  const {
    handleSubmit,
    setError,
    control,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: category,
    },
  });

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const updateCategory = useCallback(async ({ name }) => {
    const category = { id, name };
    try {
      const res = await budgetService.update(id, category);
      if (res.status === 200) {
        setState((state) => ({
          ...state,
          budgetList: state.budgetList.map((x) => {
            if (x.id === id) return { ...x, name: res.data.name };
            return x;
          }),
        }));
        alertService.info('Category updated');
        setIsEditMode(false);
      }
    } catch (error) {
      const errors = Object.keys(error.response.data).map(
        (x) => error.response.data[x]
      );
      setError('name', { message: errors });
    }
  }, []);

  const deleteCategory = useCallback(async () => {
    const result = confirm('Are you sure want to delete this category?');
    if (!result) return;
    setIsDeleting(true);

    try {
      const res = await budgetService.remove(id);
      if (res.status === 204) {
        setState((state) => ({
          ...state,
          budgetList: state.budgetList.filter((x) => x.id !== id),
        }));

        alertService.info('Category deleted');
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  }, []);

  return isEditMode ? (
    <Form onSubmit={handleSubmit(updateCategory)}>
      <FormGroup className="border rounded p-2 bg-light">
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
        <div className="d-flex justify-content-end gap-2 mt-2">
          <Tooltip text="Save" placement="bottom">
            <ButtonCircle
              small
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={handleSubmit(updateCategory)}
            >
              <TbCheck className="fs-5" />
            </ButtonCircle>
          </Tooltip>
          <Tooltip text="Cancel" placement="bottom">
            <ButtonCircle
              small
              onClick={() => {
                setValue('name', category);
                clearErrors('name');
                toggleEditMode();
              }}
            >
              <TbArrowBackUp className="fs-5" />
            </ButtonCircle>
          </Tooltip>
        </div>
      </FormGroup>
    </Form>
  ) : (
    <div className="d-flex justify-content-between mb-1 p-2 border rounded">
      <div className="ms-1 align-self-center text-truncate">{category}</div>
      <div className="d-flex">
        <Tooltip text="Edit" placement="bottom">
          <ButtonCircle small onClick={toggleEditMode}>
            <TbPencil className="fs-5" />
          </ButtonCircle>
        </Tooltip>
        <Tooltip text="Delete" placement="bottom">
          <ButtonCircle
            disabled={isDeleting}
            loading={isDeleting}
            small
            onClick={deleteCategory}
          >
            <CgTrash className="fs-5" />
          </ButtonCircle>
        </Tooltip>
      </div>
    </div>
  );
}

export default ShowOrEditCategories;
