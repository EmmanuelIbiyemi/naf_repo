import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ApplicantType2 } from "../../../../types/applicants";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  TableHead,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { Check, Delete, FileDownload } from "@mui/icons-material";
import {
  useDeleteApplicantMutation,
  useDownloadApplicantsCSVMutation,
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
    success: false,
    delete: false,
    bulkDelete: false,
  });
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantType2>();
  const [menuApplicant, setMenuApplicant] = useState<ApplicantType2 | undefined>();
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
  const [downloadApplicantsCSV] = useDownloadApplicantsCSVMutation();
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  const [statusConfirmation, setStatusConfirmation] = useState({
    open: false,
    id: 0,
    status: "",
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: 0,
  });

  const handleOpenStatusConfirmation = (id: number, status: string) => {
    setStatusConfirmation({ open: true, id, status });
  };

  const handleCloseStatusConfirmation = () => {
    setStatusConfirmation({ open: false, id: 0, status: "" });
  };

  const handleOpenDeleteConfirmation = (id: number) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({ open: false, id: 0 });
  };

  useEffect(() => {
    if (apcts?.data) setApplicants(apcts?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!apcts?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
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

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (applicants?.length && event.target.checked)
      setDeleteIds(applicants.map((apt) => apt.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    facultyId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != facultyId);
    setDeleteIds(event.target.checked ? [...newIds, facultyId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteApplicant(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    applicant: ApplicantType2
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuApplicant(applicant);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = async (id: number, status: string) => {
    handleCloseMenu();
    handleCloseStatusConfirmation();
    try {
      await updateApplicantStatus({ applicant_id: id, status }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle downloading applicants as CSV
  const handleDownloadCSV = async () => {
    try {
      const params = program_id 
        ? { program_id: +program_id, search_term: keyword }
        : { search_term: keyword };
      
      const response = await downloadApplicantsCSV(params).unwrap();
      
      // Create a blob from the response
      const blob = new Blob([response], { type: 'text/csv' });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'applicants.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log('Error downloading CSV:', error);
    }
  };

  return (
    <TableContainer>
      <ApplicantSidebar
        applicant={selectedApplicant}
        toggleDrawer={() => setSelectedApplicant(undefined)}
      />

      {/* Confirmation before changing status */}
      <Dialog
        open={statusConfirmation.open}
        onClose={handleCloseStatusConfirmation}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Change Applicant Status?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to change the applicant's status to{" "}
            <b>{statusConfirmation.status}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusConfirmation}>Cancel</Button>
          <Button
            onClick={() =>
              handleChangeStatus(
                statusConfirmation.id,
                statusConfirmation.status
              )
            }
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation before deleting applicant */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Applicant?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this applicant? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteApplicant(deleteConfirmation.id);
              handleCloseDeleteConfirmation();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can't undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Applicants ?`}
        title="Delete Applicants?"
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
          <MenuItem
            key={li.label}
            onClick={() =>
              handleOpenStatusConfirmation(menuApplicant?.id ?? 1, li.label)
            }
          >
            <Chip
              sx={{ bgcolor: li.bgcolor, color: li.color }}
              label={li.label}
              clickable
            />
            {menuApplicant?.status?.toLowerCase() === li.label.toLowerCase() ? (
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
          {/* Download CSV Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownload />}
              onClick={handleDownloadCSV}
            >
              Download CSV
            </Button>
          </Box>
          
          <Table
            sx={{
              minWidth: 650,
              ".MuiTableCell-root": {
                padding: "",
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
            aria-label="applicants table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                  align="left"
                >
                  {/* Bulk delete */}
                  <Box
                    sx={{ display: "flex", gap: "1rem", position: "relative" }}
                  >
                    <Checkbox
                      onChange={handleSelectAll}
                      checked={applicants?.length == deleteIds.length}
                    />
                    {deleteIds.length ? (
                      <Button
                        sx={{
                          position: "absolute",
                          left: "58px",
                          height: "auto",
                          textWrap: "nowrap",
                        }}
                        variant="contained"
                        color="error"
                        onClick={() =>
                          setOpenModal((prev) => ({
                            ...prev,
                            bulkDelete: true,
                          }))
                        }
                      >
                        <Delete sx={{ marginRight: ".3rem" }} />
                        Delete selected
                      </Button>
                    ) : null}
                  </Box>
                  <Typography sx={{ marginLeft: "1rem" }}>Name</Typography>
                </TableCell>
                <TableCell>Reg. Number</TableCell>
                <TableCell>Email Address</TableCell>
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
                  onClick={() => setSelectedApplicant(applicant)}
                  style={{cursor: "pointer"}}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, applicant.id as number)
                      }
                      checked={deleteIds.includes(applicant.id as number)}
                    />
                    <Typography
                      style={{
                      textTransform: "capitalize",
                      fontWeight: 500,
                      textWrap: "nowrap",
                      }}>
                      {applicant.data?.first_name && applicant.data?.last_name
                      ? applicant.data.first_name + " " + applicant.data.last_name
                      : "--"}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {applicant.data.reg_number}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {applicant.data.email}
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
                      onClick={() => handleOpenDeleteConfirmation(applicant.id as number)}
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
