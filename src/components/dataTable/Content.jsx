import React from 'react';
import Table from './Table';
import Dropdown from './DropDown';
import SearchEntries from './SearchEntries';
import Pagination from './Pagination';
import Pagination2 from './Pagination2';
import ContextTable from './ContextTable';
import Context from './Context';

function Content() {
  console.log('content');
  const [filter, setFilter] = React.useState('');
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { tableData: data } = React.useContext(Context);

  const values = React.useMemo(() => ({
    filter,
    setFilter,
    pageSize,
    setPageSize,
    firstPageIndex: (currentPage - 1) * pageSize,
    lastPageIndex: (currentPage - 1) * pageSize + pageSize,
    currentPage,
    setCurrentPage,
  }));

  // const currentTableData = React.useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * pageSize;
  //   const lastPageIndex = firstPageIndex + pageSize;
  //   return data.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage]);

  return (
    <ContextTable.Provider value={values}>
      {/* <Dropdown /> */}
      <SearchEntries />
      <Table />
      <Pagination />
      {/* <Pagination2
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      /> */}
    </ContextTable.Provider>
  );
}

export default Content;
