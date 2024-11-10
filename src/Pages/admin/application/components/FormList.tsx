import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectCurrentForm,
  setCurrentForm,
} from "../../../../store/forms.slice";
import { FormType2 } from "../../../../types/forms";
import {
  useDeleteFormMutation,
  useGetFormsQuery,
} from "../../../../store/api/form.api";
import dayjs from "dayjs";
import { selectKeyword } from "../../../../store/app.slice";

const FormList = () => {
  const { data: frms } = useGetFormsQuery(null);
  const [forms, setForms] = useState(frms?.data);
  const dispatch = useAppDispatch();
  const selectedForm = useAppSelector(selectCurrentForm);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [deleteForm] = useDeleteFormMutation();
  const keyword = useAppSelector(selectKeyword);

  useEffect(() => {
    if (keyword && frms?.data)
      setForms(
        frms.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setForms(frms?.data);
  }, [keyword]);

  const handleOpenModal = (form: FormType2) => {
    dispatch(setCurrentForm(form));
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteForm(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditForm = (form: FormType2) => {
    dispatch(setCurrentForm(form));
    navigate(`/form/${form.id}`);
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedForm?.id) handleDelete(selectedForm?.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject <strong>“${selectedForm?.name}”</strong>? You can’t undo this action.`}
        title="Delete Course?"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {!forms?.length ? (
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
          {forms?.map((form) => (
            <TableRow
              key={form.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Box>
                  <Typography
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "500 !important",
                    }}
                  >
                    {form.name.split("::")[0]}
                  </Typography>
                  <Typography>
                    Last Edited on {dayjs(form.updated_at).format("DD-MM-YYYY")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleEditForm(form)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(form)}>
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

export default FormList;
