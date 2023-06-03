import React from 'react';
import { firstBy } from 'thenby';
import Context from './Context';
import ContextTable from './ContextTable';
import Headers from './Headers';
import Rows from './Rows';
import { toMoney, toDate } from './helpers';

function Table() {
  console.log('table');
  const {
    tableData: data,
    setData: setTableData,
    formats,
    fields,
  } = React.useContext(Context);
  const { filter, firstPageIndex, lastPageIndex } =
    React.useContext(ContextTable);

  // Money and Date format
  const [moneyFields, setMoneyFields] = React.useState(new Set(formats?.money));
  const [dateFields, setDateFields] = React.useState(new Set(formats?.date));

  // Orders settings
  const keys = fields || Object.keys(data[0]);
  const [order, setOrder] = React.useState({});
  const [selectedOrder, setSelectedOrder] = React.useState({});

  //   /**
  //    * Compare function to sort data in ascending or descending order.
  //    * @param {string} property object key
  //    */
  //   function compareFn(property) {
  //     if (order[property]?.ascending) {
  //       return (a, b) => (a[property] > b[property] ? 1 : -1);
  //     }
  //     return (a, b) => (a[property] > b[property] ? -1 : 1);
  //   }

  /**
   * Filter result by any given value in the data
   * @param {*} item value
   * @returns
   */
  const filterResult = React.useCallback(
    (item) => {
      const result = keys.some((key) => {
        const value = item[key].toString().toLowerCase();
        const filterParam = filter.toLowerCase();
        // To be able to filter data with special format,
        // we add the same format to the filter parameter.

        // If money return money format => $0.00
        if (moneyFields.has(key)) {
          return toMoney(value).includes(filterParam);
        }

        // If date return date format => 01-Feb-2023
        if (dateFields.has(key)) {
          return toDate(value).includes(filterParam);
        }

        return value.includes(filterParam);
      });

      return result;
    },
    [filter]
  );

  React.useEffect(() => {
    // Set Money and Date format
    setMoneyFields(new Set(formats?.money));
    setDateFields(new Set(formats?.date));

    // Set order, first prop as default sort order
    const orders = {};
    keys.forEach((val, i) => {
      if (i === 0) {
        const first = { ascending: true, name: val };
        orders[val] = first;
        setSelectedOrder(first);
      } else {
        orders[val] = { ascending: false, name: val };
      }
    });
    setOrder(orders);
  }, [formats]);

  const values = React.useMemo(() => ({
    order,
    selectedOrder,
    setSelectedOrder,
    moneyFields,
    dateFields,
  }));

  return (
    <ContextTable.Provider value={values}>
      <div className="table-responsive">
        {data && data.length > 0 ? (
          <table className="table table-borderless table-hover">
            <thead>
              <Headers />
            </thead>
            <tbody>
              {data
                .sort(
                  firstBy(
                    selectedOrder.name,
                    selectedOrder.ascending ? 'asc' : 'desc'
                  )
                )
                .slice(firstPageIndex, lastPageIndex)
                .filter(filterResult)
                .map((item) => (
                  <Rows item={item} key={item.id} />
                ))}
            </tbody>
          </table>
        ) : (
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="text-center">No data present.</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </ContextTable.Provider>
  );
}

export default Table;
