import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BsCalendar } from 'react-icons/bs';
import { Button, Input, InputGroup, InputGroupText } from 'reactstrap';

import DatepickerComponent from '../util/DatepickerComponent';
import { incomeService } from '../../api';
import Context from '../../context/Context';
import { handleErrorResponse } from '../../assets/lib/helpers';
import { Green } from '../util/Markers';

// Datepicker marker for months.
function beforeShowMonth(date, dates) {
  const strDate = date.toISOString().substring(0, 7);
  const month = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
  });

  const incomeMark =
    dates.indexOf(strDate) !== -1 ? renderToStaticMarkup(<Green />) : '';

  return {
    content: `<div class="d-flex flex-column">
      <div>${month}</div>
      <div class="d-flex justify-content-center">
        ${incomeMark}
      </div>
    </div>`,
  };
}

// Datepicker marker for years.
function beforeShowYear(date, dates) {
  const year = date.getFullYear();

  const incomeMark =
    dates.map((x) => Number(x.substring(0, 4))).indexOf(year) !== -1
      ? renderToStaticMarkup(<Green />)
      : '';

  return {
    content: `<div class="d-flex flex-column">
        <div>${year}</div>
        <div class="d-flex justify-content-center">
          ${incomeMark}
        </div>
      </div>`,
  };
}

function ManageIncome() {
  const {
    filterDate,
    state,
    setState,
    toggleManageCategoryModal,
    toggleAddEditModal,
  } = useContext(Context);

  const datepicker = useRef(null);
  const [startDate, setStartDate] = useState(filterDate.current || new Date());

  useEffect(() => {
    incomeService
      .getIncomeDates()
      .then((res) => {
        if (res.status === 200) {
          datepicker.current.setOptions({
            beforeShowMonth: (date) => beforeShowMonth(date, res.data.results),
            beforeShowYear: (date) => beforeShowYear(date, res.data.results),
          });
        }
      })
      .catch(handleErrorResponse);
  }, [state.incomeList]);

  // Get incomes on the selected date
  const getIncomes = useCallback(async (e) => {
    // Get datepicker date
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
            color="secondary"
            className="mb-2 mb-sm-0 |"
            onClick={toggleManageCategoryModal}
          >
            Categories
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
