import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ApplicantType2 } from "../../../../types/applicants";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  TableHead,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { Check, Delete } from "@mui/icons-material";
import {
  useDeleteApplicantMutation,
  useGetApplicantsQuery,
  useUpdateApplicantStatusMutation,
} from "../../../../store/api/applicants.api";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { useParams } from "react-router-dom";
import ApplicantSidebar from "./ApplicantsSidebar";
import { Pagination } from "../../../../types/pagination";
import CustomPagination from "../../../../components/CustomPagination";

const ApplicantList = () => {
  const { program_id } = useParams();

  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantType2>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const {
    data: apcts,
    isFetching,
    isError,
  } = useGetApplicantsQuery(
    program_id
      ? { program_id: +program_id, ...pagination, search_term: keyword }
      : { ...pagination, search_term: keyword }
  );
  const [applicants, setApplicants] = useState(apcts?.data);
  const [deleteApplicant, deleteState] = useDeleteApplicantMutation();
  const [updateApplicantStatus, updateState] =
    useUpdateApplicantStatusMutation();

  useEffect(() => {
    if (apcts?.data) setApplicants(apcts?.data);
  }, [keyword, apcts]);

  useEffect(() => {
    if (
      (isFetching || updateState.isLoading || deleteState.isLoading) &&
      !isError
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, apcts, updateState, deleteState]);

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

  const handleOpenModal = (applicant: ApplicantType2, type: string) => {
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
    applicant: ApplicantType2
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
      <ApplicantSidebar
        applicant={selectedApplicant}
        toggleDrawer={() => setSelectedApplicant(undefined)}
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedApplicant) handleDeleteApplicant(selectedApplicant.id);
            console.log("proceed");
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

      {isError ? (
        <EmptyState
          title="Could not fetch Applicants"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!apcts?.data.length ? (
        <EmptyState title="No Applicants found" subTitle="" />
      ) : (
        <>
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
              {!applicants?.length ? (
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
              {applicants?.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography
                      style={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      {applicant.data.first_name +
                        " " +
                        applicant.data.last_name}
                    </Typography>
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

          <CustomPagination
            count={Math.ceil(
              apcts?.pagination.total / apcts?.pagination.per_page
            )}
            page={apcts?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: apcts?.pagination.per_page, page });
            }}
            startIndex={
              apcts?.pagination.per_page * (apcts?.pagination.page - 1) + 1
            }
            endIndex={apcts?.pagination.per_page * apcts?.pagination.page}
            totalNumber={apcts?.pagination.total}
          />
        </>
      )}
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
