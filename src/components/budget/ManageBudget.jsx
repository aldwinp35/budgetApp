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
import { ExpenseMarker, IncomeMarker } from '../util/Marker';
import { budgetService } from '../../api';

function ManageBudget() {

  const datepicker = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const { filterDate, state, setState, toggleManageCategoryModal } =
  useContext(Context);
  console.log('state: ', state)

  const Test = ({ month }) => {
    return (
      <div className="d-flex flex-column">
        <div>{month}</div>
        <div className="d-flex justify-content-center">
          {/* <span className="green-dot"></span> */}
          <IncomeMarker />
          {/* <span className="orange-dot"></span> */}
          <ExpenseMarker />
          <span className="red-dot"></span>
        </div>
      </div>
    );
  };

  // Datepicker marker for months.
  const beforeShowMonth = useCallback((date, budgetDates) => {
    const yearAndMonth = date.toISOString().substring(0, 7);
    if (budgetDates.indexOf(yearAndMonth) !== -1) {
      const monthDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
      });

      console.log('before show month')

      return {
        content: renderToStaticMarkup(<Test month={monthDate} />),
        // content: `
        //         <div class="d-flex flex-column">
        //           <div>${monthDate}</div>
        //           <div class="d-flex justify-content-center">
        //             <span class="green-dot"></span>
        //             <span class="orange-dot"></span>
        //             <span class="red-dot"></span>
        //           </div>
        //         </div>
        //           `,
      };
    }
  }, [state.budgets]);

  // Datepicker marker for years.
  const beforeShowYear = useCallback((date, budgetDates) => {
    const year = date.getFullYear();
    const years = budgetDates.map((x) => Number(x.substring(0, 4)));
    if (years.indexOf(year) !== -1) {
      return {
        content: `
                  <div class="d-flex flex-column">
                    <div>${year}</div>
                    <div class="d-flex justify-content-center">
                      <span class="green-dot"></span>
                      <span class="orange-dot"></span>
                      <span class="red-dot"></span>
                    </div>
                  </div>
                  `,
      };
    }
  }, [state.budgets]);

  // Get budget categories on the selectd date.
  const getBudget = useCallback(async (e) => {
    setStartDate(e.target.value);

    // Get datepicker date
    const month = e.detail.date.getMonth() + 1;
    const year = e.detail.date.getFullYear();

    try {
      const res = await budgetService.getByMonthAndYear(month, year);
      const { results, expenses, income, balance } = res.data;

      setState((state) => ({
        ...state,
        budgets: results,
        expenses: expenses,
        income: income,
        remainingBalance: balance,
      }));
    } catch (error) {
      handleErrorResponse(error);
    }
  }, []);

  // Datepicker data marker.
  useEffect(() => {
    budgetService
      .getBudgetDates()
      .then((res) => {
        if (res.status) {
          datepicker.current.setOptions({
            beforeShowMonth: (date) => beforeShowMonth(date, res.data.results),
            beforeShowYear: (date) => beforeShowYear(date, res.data.results),
          });
        }
      })
      .catch(handleErrorResponse);
  }, [state.budgets]);

  return (
    <div className="col-12">
      <div className="d-flex flex-column flex-sm-row justify-content-between">
        <Button
          onClick={toggleManageCategoryModal}
          color="primary"
          className="mb-2 mb-sm-0"
        >
          Add categories
        </Button>
        <div>
          <InputGroup>
            <DatepickerComponent
              inputRef={datepicker}
              customInput={<Input />}
              autohide={true}
              pickLevel="1"
              selected={startDate}
              format="MM yyyy"
              className="form-control"
              placeholder="Select month"
              onChangeDate={(e) => {
                filterDate.current = e.detail.date;

                getBudget(e);
              }}
              onShow={() => console.log('showing')}
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
