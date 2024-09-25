import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Box,
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
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { MouseEvent, useState } from "react";

type FormType = {
  id: number;
  last_edited: string;
  name: string;
  submissions: number;
};

const FormList = () => {
  const [forms, setForms] = useState<FormType[]>([
    {
      id: 1,
      last_edited: "Aug 11, 2024",
      name: "Application Form HND 24/25",
      submissions: 100,
    },
    {
      id: 2,
      last_edited: "Aug 11, 2024",
      name: "Application Form HND 24/25",
      submissions: 100,
    },
    {
      id: 3,
      last_edited: "Aug 11, 2024",
      name: "Application Form HND 24/25",
      submissions: 100,
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormType>();
  const navigate = useNavigate();

  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (form: FormType) => {
    setSelectedForm(form);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    setForms((prev) => prev.filter((form) => form.id != id));
  };

  const handleEditForm = (form: FormType) => {
    navigate("/applications/form", { state: form });
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedForm) handleDelete(selectedForm.id);
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
          {forms.map((form) => (
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
                  <Link
                    to={`/applications/form`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {form.name}
                  </Link>
                  <Typography>
                    {form.submissions} submissions * Last Edited on{" "}
                    {form.last_edited}
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
