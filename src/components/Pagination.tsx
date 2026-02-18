import * as React from 'react';
import { Text, DataTable } from 'react-native-paper';

const numberOfItemsPerPageList = [2, 3, 4];

type Props = {
  totalLength: number
  numberOfItemsPerPage: number
  page: number
  setPage: (value: number) => void
}

const Pagination = ({ pageCount, numberOfItemsPerPage = 80, page, setPage }) => {
  // const [page, setPage] = React.useState(0);
  // const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  return (
    <DataTable.Pagination
      page={page}
      numberOfPages={pageCount}
      onPageChange={page => setPage(page)}
      label={`Page ${page+1} of ${pageCount}`}
      showFastPaginationControls
      // numberOfItemsPerPageList={numberOfItemsPerPageList}
      numberOfItemsPerPage={numberOfItemsPerPage}
      // onItemsPerPageChange={onItemsPerPageChange}

      selectPageDropdownLabel={undefined}
    />
  );
};

export default Pagination;
