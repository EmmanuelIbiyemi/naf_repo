import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ApplicantType } from "../../../../types/applicants";
import {
  Box,
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
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { Check, Delete } from "@mui/icons-material";
import LoadingScreen from "../../../../components/LoadingScreen";
import {
  useDeleteApplicantMutation,
  useGetApplicantsQuery,
  useUpdateApplicantStatusMutation,
} from "../../../../store/api/applicants.api";

const ApplicantList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantType>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data: applicants, isLoading } = useGetApplicantsQuery(null);
  const [deleteApplicant, deleteState] = useDeleteApplicantMutation();
  const [updateApplicantStatus, updateState] =
    useUpdateApplicantStatusMutation();

  const menuList = [
    {
      label: "pending",
      bgcolor: "rgba(220, 220, 220, 1)",
      color: "",
    },
    {
      label: "admit",
      bgcolor: "rgba(72, 156, 33, 0.2)",
      color: "rgba(72, 156, 33, 1)",
    },
    {
      label: "reject",
      bgcolor: "rgba(229, 72, 77, 0.2)",
      color: "rgba(229, 72, 77, 1)",
    },
  ];

  const handleOpenModal = (applicant: ApplicantType, type: string) => {
    setSelectedApplicant(applicant);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedApplicant(undefined);
  };

  const handleDeleteApplicant = async (id: number) => {
    try {
      await deleteApplicant(id).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("delete");
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    applicant: ApplicantType
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplicant(applicant);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = async (id: number, status: string) => {
    handleCloseMenu();
    try {
      await updateApplicantStatus({ applicant_id: id, status }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer>
      {[isLoading, deleteState.isLoading, updateState.isLoading].some(
        (item) => item
      ) ? (
        <Box sx={{ position: "relative", zIndex: 2000 }}>
          <LoadingScreen />
        </Box>
      ) : null}

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedApplicant) handleDeleteApplicant(selectedApplicant.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText=""
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Applicant`}
        title="Delete Applicant?"
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        sx={menuStyles}
      >
        <Typography variant="h6" sx={{ padding: ".5rem 1rem" }}>
          Change Status
        </Typography>
        {menuList.map((li) => (
          <MenuItem key={li.label} onClick={handleCloseMenu}>
            <Chip
              sx={{ bgcolor: li.bgcolor, color: li.color }}
              label={li.label}
              clickable
              onClick={() =>
                handleChangeStatus(selectedApplicant?.id || 1, li.label)
              }
            />
            {selectedApplicant?.status?.toLowerCase() ==
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
          {applicants?.data.map((applicant) => (
            <TableRow
              key={applicant.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Button
                  sx={{
                    "&.MuiButton-root": {
                      border: "none",
                      color: "inherit",
                      padding: 0,
                      textTransform: "capitalize",
                      justifyContent: "start",
                      textAlign: "left",
                    },
                  }}
                >
                  {applicant.data.first_name + " " + applicant.data.last_name}
                </Button>
              </TableCell>
              <TableCell component="th" scope="row">
                {applicant.data.email}
              </TableCell>
              <TableCell component="th" scope="row">
                {applicant.data.phone}
              </TableCell>
              <TableCell component="th" scope="row">
                <Chip
                  label={applicant.status || "Pending"}
                  clickable
                  sx={{
                    bgcolor: menuList.find(
                      (li) =>
                        li.label.toLowerCase() ==
                        applicant.status?.toLowerCase()
                    )?.bgcolor,
                    color: menuList.find(
                      (li) =>
                        li.label.toLowerCase() ==
                        applicant.status?.toLowerCase()
                    )?.color,
                  }}
                  onClick={(event) => handleOpenMenu(event, applicant)}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => handleOpenModal(applicant, "delete")}
                >
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
