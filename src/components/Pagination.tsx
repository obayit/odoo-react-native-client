import * as React from 'react';
import { Text, DataTable } from 'react-native-paper';

const numberOfItemsPerPageList = [2, 3, 4];

type Props = {
  totalLength: number
  numberOfItemsPerPage: number
  page: number
  setPage: (value: number) => void
}

const Pagination = ({ totalLength, numberOfItemsPerPage=80, page, setPage }) => {
  // const [page, setPage] = React.useState(0);
  // const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, totalLength);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  return (
    <>
    <Text>numberOfItemsPerPage = {numberOfItemsPerPage+''}</Text>
    <DataTable.Pagination
      page={page}
      numberOfPages={Math.ceil(totalLength / numberOfItemsPerPage)}
      onPageChange={page => setPage(page)}
      label={`${from + 1}-${to} of ${totalLength}`}
      showFastPaginationControls
      // numberOfItemsPerPageList={numberOfItemsPerPageList}
      numberOfItemsPerPage={numberOfItemsPerPage}
      // onItemsPerPageChange={onItemsPerPageChange}

      selectPageDropdownLabel={undefined}
    />
    </>
  );
};

export default Pagination;
