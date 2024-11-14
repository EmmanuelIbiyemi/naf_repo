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

const EligiblesList: React.FC = () => {
  const { data: elgbles, isFetching } = useGetEligiblesQuery(null);
  const [deleteEligible, deleteState] = useDeleteEligiblesMutation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedEligible, setSelectedEligible] = useState<EligibleType>();
  const [eligibles, setEligibles] = useState<EligibleType[] | undefined>(
    elgbles?.data
  );
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && elgbles?.data)
      setEligibles(
        elgbles.data.filter((elg) =>
          elg.reg_number.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setEligibles(elgbles?.data);
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
          undo: () => {
            console.log("cancel");
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
          {eligibles?.map((eligible: EligibleType) => (
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
              <TableCell align="center">{eligible.program}</TableCell>
              <TableCell align="center">{eligible.level}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EligiblesList;
