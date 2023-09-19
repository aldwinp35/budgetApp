import React, { useState, useRef, useCallback, useContext } from 'react';
import { BsCalendar } from 'react-icons/bs';
import { Button, Input, InputGroup, InputGroupText } from 'reactstrap';

import DatepickerComponent from '../util/DatepickerComponent';
import { incomeService } from '../../api';
import Context from '../../context/Context';
import { handleErrorResponse } from '../../assets/lib/helpers';

function ManageIncome() {
  const datepicker = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const {
    filterDate,
    setState,
    toggleManageCategoryModal,
    toggleAddEditModal,
  } = useContext(Context);

  // Get incomes on the selected date
  const getIncomes = useCallback(async (e) => {
    // Get picker date
    const month = e.detail.date.getMonth() + 1;
    const year = e.detail.date.getFullYear();

    try {
      const responses = await Promise.all([
        incomeService.getByMonthAndYear(month, year),
        incomeService.getCategories(),
      ]);
      const [incomeResponse, categoryResponse] = responses;

      setState((state) => ({
        ...state,
        incomeList: incomeResponse.data.results,
        categoryList: categoryResponse.data.results,
        loading: false,
      }));
    } catch (error) {
      handleErrorResponse(error);
    }
  }, []);

  return (
    <div className="col-12">
      <div className="d-flex flex-column flex-sm-row justify-content-between">
        <div className="d-flex flex-column flex-sm-row">
          <Button
            color="primary"
            className="mb-2 mb-sm-0 | me-0 me-sm-2 |"
            onClick={toggleAddEditModal}
          >
            New income
          </Button>
          <Button
            color="primary"
            className="mb-2 mb-sm-0 |"
            onClick={toggleManageCategoryModal}
          >
            Add categories
          </Button>
        </div>

        <div>
          <InputGroup>
            <DatepickerComponent
              inputRef={datepicker}
              customInput={<Input />}
              autohide={true}
              pickLevel="1"
              selected={startDate}
              todayButton
              format="MM yyyy"
              className="form-control"
              placeholder="Select month"
              onChangeDate={(e) => {
                filterDate.current = e.detail.date;
                setStartDate(e.target.value);
                setState((state) => ({
                  ...state,
                  loading: true,
                }));

                getIncomes(e);
              }}
              showOnClick={false}
              showOnFocus={false}
            />
            <InputGroupText
              onClick={() => datepicker.current.toggle()}
              role="button"
            >
              <BsCalendar />
            </InputGroupText>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}

export default ManageIncome;
