import React from 'react';
import PropTypes from 'prop-types';
import { firstBy } from 'thenby';
import Loading from './Loading';
import Options from './Options';
import Headers from './Headers';
import Rows from './Rows';
import Pagination from './Pagination';
import Context from './Context';
import { toMoney, toDate, checkForKeys, getOrderKeys } from './helpers';
import './style.css';

function Datatable({ options }) {
  // Print

  // Datatable
  const [data, setData] = React.useState(null);
  const [keys, setKeys] = React.useState(null);
  const moneyFields = new Set(options?.formats?.money);
  const dateFields = new Set(options?.formats?.date);

  // Order and filter
  const [orders, setOrders] = React.useState({});
  const [selectedOrder, setSelectedOrder] = React.useState({});
  const [filter, setFilter] = React.useState('');

  // Pagination
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const firstPageIndex = (currentPage - 1) * pageSize;
  const lastPageIndex = (currentPage - 1) * pageSize + pageSize;

  /**
   * Filter result by any given value in the data
   * @param {*} item value
   * @returns
   */
  const filterPredicate = React.useCallback(
    (item) => {
      const filterResult = keys.some((key) => {
        const filterParam = filter.toLowerCase();
        let value = item[key];
        // To be able to filter data with special format,
        // we add the same format to the filter parameter.

        // If money return money format => $0.00
        if (moneyFields.has(key)) value = toMoney(value);

        // If date return date format => 01-Feb-2023
        if (dateFields.has(key)) value = toDate(value);

        return value.toString().toLowerCase().includes(filterParam);
      });
      return filterResult;
    },
    [filter]
  );

  /**
   * Return data whether it is filtered or not
   * @returns
   */
  const getData = () => {
    const result = filter ? data.filter(filterPredicate) : data;

    return result;
  };

  React.useEffect(() => {
    (async () => {
      /* Get and set data */

      // Make sure data is passed
      if (!options.data) {
        throw new Error('Missing "data" in datatable options.');
      }

      // Get data
      let myData = await options.data;

      // Check if data is a function
      if (typeof myData === 'function') {
        myData = await options.data();
      }

      // Set data
      setData(myData);

      /* Get and set keys */

      // Make sure data is valid
      if (!data || data?.length === 0) {
        return;
      }

      // Make sure every object have an "id"
      // If "fields" were passed, make sure those exist in each data object
      const myKeys = checkForKeys(data[0], options?.fields);

      // Set keys
      setKeys(myKeys);

      /* Set orders by data object keys */

      // Make sure keys are valid
      if (!keys || keys?.length === 0) {
        return;
      }

      // Get object of keys to sort data
      const orderKeys = getOrderKeys(keys);

      // Set first key as default order ascendingly
      const defaultOrder = orderKeys[keys[0]];
      defaultOrder.ascending = true;
      setSelectedOrder(defaultOrder);

      // Set orders
      setOrders(orderKeys);

      /*  */
    })();
  }, [
    options.data?.length,
    options.fields?.length,
    data?.length,
    keys?.length,
  ]);

  const values = React.useMemo(
    () => ({
      // Datatable
      data,
      keys,
      title: options.title,
      dateFields,
      moneyFields,
      rowActions: options.rowActions,

      // Order and filter
      orders,
      setSelectedOrder,
      selectedOrder,
      filter,
      setFilter,

      // Pagination
      pageSize,
      setPageSize,
      currentPage,
      setCurrentPage,
      firstPageIndex,
      lastPageIndex,
    }),
    [keys, filter, orders, selectedOrder, pageSize, currentPage, options.title]
  );

  if (!data) return <Loading />;

  return (
    <Context.Provider value={values}>
      <Options />
      <div className="table-responsive">
        {data.length > 0 ? (
          <table className="table table-hover">
            <thead>
              <Headers />
            </thead>
            <tbody>
              {getData().length === 0 ? (
                <tr className="">
                  <td
                    colSpan={keys.length + 1}
                    className="text-center border-0"
                  >
                    No results.
                  </td>
                </tr>
              ) : null}
              {getData()
                .sort(
                  firstBy(
                    selectedOrder.name,
                    selectedOrder.ascending ? 'asc' : 'desc'
                  )
                )
                .slice(firstPageIndex, lastPageIndex)
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
      {data.length > 0 ? (
        <Pagination totalRows={filter ? getData()?.length : data?.length} />
      ) : null}
    </Context.Provider>
  );
}

Datatable.propTypes = {
  options: PropTypes.shape({
    title: PropTypes.string,
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(Object),
      PropTypes.func,
      PropTypes.object,
    ]),
    exclude: PropTypes.arrayOf(String),
    fields: PropTypes.arrayOf(String),
    formats: PropTypes.shape({
      money: PropTypes.arrayOf(String),
      date: PropTypes.arrayOf(String),
    }),
    rowActions: PropTypes.shape({
      edit: PropTypes.func,
      delete: PropTypes.func,
    }),
  }).isRequired,
};

export default Datatable;
