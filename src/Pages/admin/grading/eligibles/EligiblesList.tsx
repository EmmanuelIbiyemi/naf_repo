import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Button,
  Typography,
} from "@mui/material";
import {
  useDeleteEligiblesMutation,
  useGetEligiblesQuery,
} from "../../../../store/api/eligibles.api";
import { EligibleType } from "../../../../types/eligibles";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import CustomPagination from "../../../../components/CustomPagination";
import { Pagination } from "../../../../types/pagination";

const EligiblesList: React.FC = () => {
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const { data: elgbles, isFetching } = useGetEligiblesQuery({
    ...pagination,
    search_term: keyword,
  });
  const [deleteEligible, deleteState] = useDeleteEligiblesMutation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedEligible, setSelectedEligible] = useState<EligibleType>();
  const [eligibles, setEligibles] = useState<EligibleType[] | undefined>(
    elgbles?.data
  );

  useEffect(() => {
    if (elgbles?.data) setEligibles(elgbles?.data);
  }, [keyword, elgbles]);

  const handleDelete = async (id: number) => {
    try {
      await deleteEligible(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDeleteModal = (eligible: EligibleType) => {
    setOpenModal(true);
    setSelectedEligible(eligible);
  };
  const handleCloseDeleteModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (isFetching || deleteState.isLoading) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, deleteState]);

  return (
    <TableContainer>
      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedEligible) handleDelete(selectedEligible.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseDeleteModal()}
        infoText="You can’t undo this action !"
        open={openModal}
        subTitle={`Are you sure you want to delete “${selectedEligible?.reg_number}” ?`}
        title="Delete Eligible ?"
      />

      <Table
        sx={{
          minWidth: 650,
          ".MuiSelect-select": { padding: ".5rem", maxWidth: "200px" },
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              borderBottom: "1px solid",
              "&:last-child td, &:last-child th": { border: 0 },
              "td.MuiTableCell-body": {
                padding: 0,
              },
            }}
          >
            <TableCell
              component="th"
              scope="row"
              sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
            >
              Reg number
            </TableCell>
            <TableCell align="center">Session</TableCell>
            <TableCell align="center">Program</TableCell>
            <TableCell align="center">Level</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!eligibles?.length ? (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                No items found
              </TableCell>
            </TableRow>
          ) : null}
          {elgbles?.data.length
            ? eligibles?.map((eligible: EligibleType) => (
                <TableRow
                  key={eligible.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "td.MuiTableCell-body": {
                      padding: 0,
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Typography style={{ textTransform: "capitalize" }}>
                      {eligible.reg_number}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{eligible.session}</TableCell>
                  <TableCell align="center">{eligible.program.name}</TableCell>
                  <TableCell align="center">{eligible.level.name}</TableCell>
                  <TableCell align="center">
                    {dayjs(eligible.created_at).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      sx={{ color: "grey" }}
                      onClick={() => handleOpenDeleteModal(eligible)}
                    >
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      {elgbles?.data.length ? (
        <CustomPagination
          count={Math.ceil(
            elgbles?.pagination.total / elgbles?.pagination.per_page
          )}
          page={elgbles?.pagination.page}
          handleChangePage={(_, page) => {
            setPagination({ per_page: elgbles?.pagination.per_page, page });
          }}
          startIndex={
            elgbles?.pagination.per_page * (elgbles?.pagination.page - 1) + 1
          }
          endIndex={elgbles?.pagination.per_page * elgbles?.pagination.page}
          totalNumber={elgbles?.pagination.total}
        />
      ) : null}
    </TableContainer>
  );
};

export default EligiblesList;
