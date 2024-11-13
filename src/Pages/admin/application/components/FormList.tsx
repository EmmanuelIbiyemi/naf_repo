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
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";

const FormList = () => {
  const { data: frms, isFetching, isError } = useGetFormsQuery(null);
  const [forms, setForms] = useState(frms?.data);
  const dispatch = useAppDispatch();
  const selectedForm = useAppSelector(selectCurrentForm);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [deleteForm, deleteState] = useDeleteFormMutation();
  const keyword = useAppSelector(selectKeyword);

  useEffect(() => {
    if (keyword && frms?.data)
      setForms(
        frms.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setForms(frms?.data);
  }, [keyword, frms]);

  useEffect(() => {
    if (isFetching || deleteState.isLoading) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, frms, deleteState]);

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
        infoText=""
        open={openModal}
        subTitle={`Are you sure you want to delete form ${selectedForm?.name}”</strong>? You can’t undo this action.`}
        title="Delete Course?"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Forms"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!forms?.length ? (
        <EmptyState
          title="No Forms found"
          subTitle="Forms will appear here after you add them in your school."
        />
      ) : null}

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
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
