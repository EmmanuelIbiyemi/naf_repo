import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { DiscountFormAction, Discount } from "../../../../types/discounts.ts";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteDiscountMutation,
  useGetDiscountsQuery,
  useUpdateDiscountMutation,
} from "../../../../store/api/discounts.api.ts";
import FormModal from "../../../../components/FormModal";
import DiscountForm from "./DiscountsForm";
import SuccessModal from "../../../../components/SuccessModal";

const DiscountsList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>();
  const { data: discounts } = useGetDiscountsQuery(null);
  const [deleteDiscount] = useDeleteDiscountMutation();
  const [updateDiscount] = useUpdateDiscountMutation();

  const handleOpenModal = (discount: Discount, type: string) => {
    setSelectedDiscount(discount);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedDiscount(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (discount_id: number) => {
    try {
      await deleteDiscount(discount_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditDiscount = async (discount: Discount) => {
    try {
      await updateDiscount(discount).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(discount, "success");
  };

  return (
    <TableContainer>
      {/* EDIT */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <DiscountForm
          actions={{
            submit: handleEditDiscount as DiscountFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          discount={selectedDiscount}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedDiscount) handleDelete(selectedDiscount.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="This action cannot be undone."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete the discount with condition "${selectedDiscount?.condition}"?`}
        title="Delete Discount?"
      />

      {/* Success */}
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
          setSelectedDiscount(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully updated the discount with condition "${selectedDiscount?.condition}".`}
        title="Update Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {discounts?.data.map((discount: Discount) => (
            <TableRow
              key={discount.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link to={`/discounts/${discount.id}`}>
                  Condition: {discount.condition}
                </Link>
              </TableCell>
              <TableCell>GPA: {discount.gpa}</TableCell>
              <TableCell>Discount: {discount.discount_percentage}%</TableCell>
              <TableCell>{discount.description}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(discount, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(discount, "delete")}>
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

export default DiscountsList;