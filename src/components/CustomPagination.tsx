import { Box, Pagination, Typography } from "@mui/material";

type PaginationProps = {
  startIndex: number;
  endIndex: number;
  totalNumber: number;
  count: number;
  page: number;
  handleChangePage: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const CustomPagination = ({
  startIndex,
  endIndex,
  totalNumber,
  count,
  page,
  handleChangePage,
}: PaginationProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "2em",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {startIndex} to {endIndex} of {totalNumber} entries
      </Typography>
      <Pagination
        count={count}
        page={page}
        onChange={handleChangePage}
        color="primary"
        shape="rounded"
        sx={{ color: "#CCCCCC" }}
      />
    </Box>
  );
};

export default CustomPagination;
