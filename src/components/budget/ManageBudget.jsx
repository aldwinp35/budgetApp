import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Input, InputGroup, InputGroupText } from 'reactstrap';
import { BsCalendar } from 'react-icons/bs';

import DatepickerComponent from '../util/DatepickerComponent';
import Context from '../../context/Context';
import { handleErrorResponse } from '../../assets/lib/helpers';
import { Orange, Green, Red } from '../util/Markers';
import { budgetService } from '../../api';

// Datepicker marker for months.
function beforeShowMonth(date, dates) {
  const strDate = date.toISOString().substring(0, 7);
  const month = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
  });

  const { income, budget, expense } = dates;

  const incomeMark =
    income.indexOf(strDate) !== -1 ? renderToStaticMarkup(<Green />) : '';
  const budgetMark =
    budget.indexOf(strDate) !== -1 ? renderToStaticMarkup(<Orange />) : '';
  const expenseMark =
    expense.indexOf(strDate) !== -1 ? renderToStaticMarkup(<Red />) : '';

  return {
    content: `<div class="d-flex flex-column">
      <div>${month}</div>
      <div class="d-flex justify-content-center">
        ${incomeMark}
        ${budgetMark}
        ${expenseMark}
      </div>
    </div>`,
  };
}

// Datepicker marker for years.
function beforeShowYear(date, dates) {
  const year = date.getFullYear();

  const { income, budget, expense } = dates;

  const incomeMark =
    income.map((x) => Number(x.substring(0, 4))).indexOf(year) !== -1
      ? renderToStaticMarkup(<Green />)
      : '';
  const budgetMark =
    budget.map((x) => Number(x.substring(0, 4))).indexOf(year) !== -1
      ? renderToStaticMarkup(<Orange />)
      : '';
  const expenseMark =
    expense.map((x) => Number(x.substring(0, 4))).indexOf(year) !== -1
      ? renderToStaticMarkup(<Red />)
      : '';

  return {
    content: `<div class="d-flex flex-column">
        <div>${year}</div>
        <div class="d-flex justify-content-center">
          ${incomeMark}
          ${budgetMark}
          ${expenseMark}
        </div>
      </div>`,
  };
}

function ManageBudget() {
  const datepicker = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const { filterDate, state, setState, toggleManageCategoryModal } =
    useContext(Context);

  // Get budget categories on the selectd date.
  const getBudget = useCallback(async (e) => {
    // Get datepicker date
    const month = e.detail.date.getMonth() + 1;
    const year = e.detail.date.getFullYear();

    try {
      const res = await budgetService.getByMonthAndYear(month, year);

      if (res.status === 200) {
        const { results, expenses, income, balance, planned } = res.data;

        setState((state) => ({
          ...state,
          budgetList: results,
          expenses: expenses,
          income: income,
          planned: planned,
          remainingBalance: balance,
        }));
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  }, []);

  // Datepicker data marker.
  useEffect(() => {
    budgetService
      .getDates()
      .then((res) => {
        if (res.status === 200) {
          datepicker.current.setOptions({
            beforeShowMonth: (date) => beforeShowMonth(date, res.data.results),
            beforeShowYear: (date) => beforeShowYear(date, res.data.results),
          });
        }
      })
      .catch(handleErrorResponse);
  }, [state.budgetList]);

  return (
    <div className="col-12">
      <div className="d-flex flex-column flex-sm-row justify-content-between">
        <Button
          onClick={toggleManageCategoryModal}
          color="primary"
          className="mb-2 mb-sm-0"
        >
          Categories
        </Button>
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
                getBudget(e);
              }}
              showOnClick={false}
              showOnFocus={false}
            />
            <InputGroupText
              onClick={() => {
                datepicker.current.toggle();
              }}
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

export default ManageBudget;
