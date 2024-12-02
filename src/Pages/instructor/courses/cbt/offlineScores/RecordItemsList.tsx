import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, IconButton, TableHead } from "@mui/material";
import { recordResponse } from "../../../../../types/records";
import { Delete, Edit } from "@mui/icons-material";
import { useDeleteRecordMutation } from "../../../../../store/api/records.api";
import DeleteConfirmationModal from "../../../../../components/DeleteConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState } from "react";

type ListProps = {
  lists: recordResponse[];
  handleButtonClick: (recordItem: recordResponse) => void;
  refetch?: () => void;
};

const RecordsItemsList = ({ lists, handleButtonClick, refetch }: ListProps) => {
  const [deleteRecord, { isLoading }] = useDeleteRecordMutation();

  // State for delete confirmation modal
  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    recordId: null as number | null,
    recordName: "",
  });

  // State for success modal after deletion
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);

  // Handle clicking the delete button
  const handleDeleteClick = (record: recordResponse) => {
    setDeleteModalState({
      open: true,
      recordId: record.id,
      recordName: record.name,
    });
  };

  // Handle the actual deletion
  const handleConfirmDelete = async () => {
    if (deleteModalState.recordId) {
      try {
        await deleteRecord({ record_id: deleteModalState.recordId }).unwrap();
        setDeleteModalState({ open: false, recordId: null, recordName: "" });
        setDeleteSuccessModal(true);
        if (refetch) {
          refetch();
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ border: "1px solid #D9D9D9" }}>
              {tableHead.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#F1F1F1",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {lists?.map((item) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.obtainable_score}</TableCell>
                <TableCell>{formatDate(item?.updated_at)}</TableCell>
                <TableCell sx={{ display: "flex", gap: 2 }}>
                  <IconButton onClick={() => handleButtonClick(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(item)}
                    disabled={isLoading}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmationModal
        actions={{
          proceed: handleConfirmDelete,
        }}
        close={() => setDeleteModalState((prev) => ({ ...prev, open: false }))}
        infoText="You can’t undo this action."
        open={deleteModalState.open}
        subTitle={`Are you sure you want to delete record "${deleteModalState.recordName}" ?`}
        title="Delete Record?"
      />

      <SuccessModal
        close={() => setDeleteSuccessModal(false)}
        infoText=""
        open={deleteSuccessModal}
        subTitle="Record has been successfully deleted!"
        title="Successful"
      />
    </Box>
  );
};

const tableHead = [
  { id: 1, label: "Record name", minWidth: 170 },
  { id: 2, label: "Obtainable score", minWidth: 170 },
  { id: 3, label: "Last updated", minWidth: 170 },
  { id: 4, label: "Action", minWidth: 100 },
];

export default RecordsItemsList;
