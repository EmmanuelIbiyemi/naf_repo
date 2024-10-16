import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  Typography,
} from "@mui/material";
import {
  Delete,
  Drafts,
  Edit,
  Lock,
  MoreVert,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { MouseEvent, useState } from "react";
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

const FormList = () => {
  const { data: forms } = useGetFormsQuery(null);
  const dispatch = useAppDispatch();
  const selectedForm = useAppSelector(selectCurrentForm);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [deleteForm] = useDeleteFormMutation();

  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    navigate("/applications/form", { state: form.id });
  };

  const handleViewForm = (form: FormType2) => {
    dispatch(setCurrentForm(form));
    navigate("/applications/applicants", { state: form.id });
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

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Box sx={iconStyles}>
            <Drafts />
          </Box>
          Open Application
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Box sx={iconStyles}>
            <Lock />
          </Box>
          Close Application
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/applications/applicants");
          }}
        >
          <Box sx={iconStyles}>
            <Visibility />
          </Box>
          View Applied
        </MenuItem>
      </Menu>

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {forms?.data.map((form) => (
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
                  <Button
                    variant="text"
                    onClick={() => handleViewForm(form)}
                    sx={{
                      textTransform: "capitalize",
                      border: "none !important",
                      padding: "0 !important",
                      display: "block !important",
                      textAlign: "left",
                    }}
                  >
                    {form.name}
                  </Button>
                  <Typography>
                    {form.fee} submissions * Last Edited on{" "}
                    {dayjs(form.updated_at).format()}
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
                <IconButton onClick={handleClick}>
                  <MoreVert />
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

const iconStyles: SxProps = {
  border: "2px solid rgba(179, 179, 179, 1)",
  borderRadius: "100%",
  display: "grid",
  height: "25px",
  marginRight: ".5rem",
  placeItems: "center",
  width: "25px",

  svg: {
    fontSize: "18px",
    color: "rgba(179, 179, 179, 1)",
  },
};
