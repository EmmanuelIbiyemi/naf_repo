import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  DepartmentType,
  DepartmentFormAction,
} from "../../../../types/department";
import { Box, Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "../../../../store/api/departments.api";
import FormModal from "../../../../components/FormModal";
import DepartmentForm from "./DepartmentForm";
import SuccessModal from "../../../../components/SuccessModal";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import EmptyState from "../../../../components/EmptyState";
import CustomPagination from "../../../../components/CustomPagination";
import { Pagination } from "../../../../types/pagination";

const DepartmentList = () => {
  const { faculty_id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    bulkDelete: false,
  });
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentType>();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const {
    data: deps,
    isFetching,
    isError,
  } = useGetDepartmentsQuery({
    faculty_id: +(faculty_id || 0),
    search_term: keyword,
    ...pagination,
  });
  const [departments, setDepartments] = useState<DepartmentType[] | undefined>(
    deps?.data
  );
  const [deleteDepartment, deleteState] = useDeleteDepartmentMutation();
  const [updateDepartment, updateState] = useUpdateDepartmentMutation();
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (deps?.data) setDepartments(deps?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!deps?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, deps]);

  useEffect(() => {
    if (
      (isFetching && !isError) ||
      deleteState.isLoading ||
      updateState.isLoading
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, deps, deleteState, updateState]);

  const handleOpenModal = (department: DepartmentType, type: string) => {
    setSelectedDepartment(department);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedDepartment(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (department_id: number) => {
    try {
      await deleteDepartment(department_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (departments?.length && event.target.checked)
      setDeleteIds(departments.map((fac) => fac.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    departmentId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != departmentId);
    setDeleteIds(event.target.checked ? [...newIds, departmentId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteDepartment(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
  };

  const handleEditDepartment = async (department: DepartmentType) => {
    try {
      await updateDepartment(department).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(department, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <DepartmentForm
          actions={{
            submit: handleEditDepartment as DepartmentFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          department={selectedDepartment}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedDepartment)
              handleDelete(selectedDepartment.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Department “${selectedDepartment?.name}” ?`}
        title="Delete Department?"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} departments ?`}
        title="Delete Departments?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedDepartment(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Department “${selectedDepartment?.name}”.`}
        title="Updates Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Departments"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!departments?.length && !isError ? (
        <EmptyState
          title="No Departments found"
          subTitle="Departments will appear here after you add them in your school."
        />
      ) : null}

      {/* Bulk delete */}
      <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={departments?.length == deleteIds.length}
        />
        {deleteIds.length ? (
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              setOpenModal((prev) => ({ ...prev, bulkDelete: true }))
            }
          >
            <Delete sx={{ marginRight: ".3rem" }} />
            Delete selected
          </Button>
        ) : null}
      </Box>

      {deps?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {departments?.map((department: DepartmentType) => (
                <TableRow
                  key={department.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, department.id as number)
                      }
                      checked={deleteIds.includes(department.id as number)}
                    />
                    <Button
                      onClick={() =>
                        navigate(`/academics/${faculty_id}/${department.id}`)
                      }
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
                      {department.name}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(department, "edit")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(department, "delete")}
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
              deps?.pagination.total / deps?.pagination.per_page
            )}
            page={deps?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: deps?.pagination.per_page, page });
            }}
            startIndex={
              deps?.pagination.per_page * (deps?.pagination.page - 1) + 1
            }
            endIndex={deps?.pagination.per_page * deps?.pagination.page}
            totalNumber={deps?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default DepartmentList;
