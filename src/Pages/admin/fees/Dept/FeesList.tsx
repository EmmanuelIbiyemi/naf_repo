import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { FeeFormAction, Fee } from "../../../../types/fees";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteFeeMutation,
  useGetLevelFeesQuery,
  useUpdateFeeMutation,
} from "../../../../store/api/fees.api";
import FormModal from "../../../../components/FormModal";
import FeeForm from "./FeesForm";
import SuccessModal from "../../../../components/SuccessModal";

interface FeesListProps {
  level: string | null;
}

const FeesList: React.FC<FeesListProps> = ({ level }) => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedFee, setSelectedFee] = useState<Fee>();
  const { data: fees, isLoading } = useGetLevelFeesQuery(
    level ? level.toString() : null
  );
  const [deleteFee] = useDeleteFeeMutation();
  const [updateFee] = useUpdateFeeMutation();

  const handleOpenModal = (fee: Fee, type: string) => {
    setSelectedFee(fee);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedFee(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (fee_id: number) => {
    try {
      await deleteFee(fee_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditFee = async (fee: Fee) => {
    try {
      await updateFee(fee).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(fee, "success");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!fees?.data || fees.data.length === 0) {
    return <div>No fees found.</div>;
  }

  return (
    <TableContainer>
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <FeeForm
          actions={{
            submit: handleEditFee as FeeFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          fee={selectedFee}
        />
      </FormModal>

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedFee) handleDelete(selectedFee.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this Fee will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Fee <strong>"${selectedFee?.name}? You can't undo this action.`}
        title="Delete Fee?"
      />

      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => {
          handleCloseModal("success");
          setSelectedFee(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully updated the Fee <strong>"${selectedFee?.name}.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {fees.data.map((fee: Fee) => (
            <TableRow
              key={fee.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/fees/${fee.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {fee.name}
                </Link>
              </TableCell>
              <TableCell align="right">{fee.fee}</TableCell>
              <TableCell align="right">{fee.level}</TableCell>
              <TableCell align="right">{fee.faculty}</TableCell>
              <TableCell align="right">{fee.Department}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(fee, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(fee, "delete")}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeesList;
