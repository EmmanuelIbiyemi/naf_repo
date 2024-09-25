import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ApplicantType } from "../../../types/applicants";
import {
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  TableHead,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { Check, Delete } from "@mui/icons-material";

const ApplicantList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantType>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [applicants, setApplicants] = useState<ApplicantType[]>([
    {
      id: 1,
      name: "John Doe",
      email: "user@email.com",
      phone: "09012345678",
      status: "Applied",
    },
    {
      id: 2,
      name: "John Doe",
      email: "user@email.com",
      phone: "09012345678",
      status: "Applied",
    },
    {
      id: 3,
      name: "John Doe",
      email: "user@email.com",
      phone: "09012345678",
      status: "Applied",
    },
  ]);

  const menuList = [
    {
      label: "Applied",
      bgcolor: "rgba(220, 220, 220, 1)",
      color: "",
    },
    {
      label: "Accepted",
      bgcolor: "rgba(72, 156, 33, 0.2)",
      color: "rgba(72, 156, 33, 1)",
    },
    {
      label: "Rejected",
      bgcolor: "rgba(229, 72, 77, 0.2)",
      color: "rgba(229, 72, 77, 1)",
    },
    {
      label: "In Review",
      bgcolor: "rgba(19, 41, 106, 0.2)",
      color: "rgba(19, 41, 106, 1)",
    },
  ];

  const handleOpenModal = (applicant: ApplicantType) => {
    setSelectedApplicant(applicant);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    setApplicants((prev) => prev.filter((ap) => ap.id != id));
  };

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    applicant: ApplicantType
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplicant(applicant);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = (id: number, status: string) => {
    handleClose();
    const foundApplicant = applicants.find((ap) => ap.id == id);
    if (foundApplicant) foundApplicant.status = status;
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedApplicant) handleDelete(selectedApplicant.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject`}
        title="Delete Course?"
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={menuStyles}
      >
        <Typography variant="h6" sx={{ padding: ".5rem 1rem" }}>
          Change Status
        </Typography>
        {menuList.map((li) => (
          <MenuItem key={li.label} onClick={handleClose}>
            <Chip
              sx={{ bgcolor: li.bgcolor, color: li.color }}
              label={li.label}
              clickable
              onClick={() =>
                handleChangeStatus(selectedApplicant?.id || 1, li.label)
              }
            />
            {selectedApplicant?.status.toLowerCase() ==
            li.label.toLowerCase() ? (
              <Check />
            ) : null}
          </MenuItem>
        ))}
      </Menu>

      <Table
        sx={{
          minWidth: 650,
          ".MuiTableCell-root": {
            maxWidth: 200,
            a: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email Address</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow
              key={applicant.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Button
                  style={{
                    border: "none",
                    color: "inherit",
                    padding: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {applicant.name}
                </Button>
              </TableCell>
              <TableCell component="th" scope="row">
                {applicant.email}
              </TableCell>
              <TableCell component="th" scope="row">
                {applicant.phone}
              </TableCell>
              <TableCell component="th" scope="row">
                <Chip
                  label={applicant.status}
                  clickable
                  sx={{
                    bgcolor: menuList.find(
                      (li) =>
                        li.label.toLowerCase() == applicant.status.toLowerCase()
                    )?.bgcolor,
                    color: menuList.find(
                      (li) =>
                        li.label.toLowerCase() == applicant.status.toLowerCase()
                    )?.color,
                  }}
                  onClick={(event) => handleClick(event, applicant)}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleOpenModal(applicant)}>
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

export default ApplicantList;

const menuStyles: SxProps = {
  li: {
    display: "flex",
    justifyContent: "space-between",
    width: "220px",
    "&:hover": {
      bgcolor: "rgba(240, 249, 255, 1)",
    },
  },
};
