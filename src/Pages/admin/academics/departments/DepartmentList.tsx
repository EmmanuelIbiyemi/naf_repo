import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Department,
  DepartmentFormAction,
} from "../../../../types/departments";
import { Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
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

const DepartmentList = () => {
  const { faculty_id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const {
    data: deps,
    isFetching,
    isError,
  } = useGetDepartmentsQuery(+(faculty_id || 0));
  const [departments, setDepartments] = useState<Department[] | undefined>(
    deps?.data
  );
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && deps?.data)
      setDepartments(
        deps.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setDepartments(deps?.data);
  }, [keyword, deps]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, deps]);

  const handleOpenModal = (department: Department, type: string) => {
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

  const handleEditDepartment = async (department: Department) => {
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
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The instructors enrolled in this Department will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Department “${selectedDepartment?.name}” ? You can’t undo this action.`}
        title="Delete Department?"
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
          setSelectedDepartment(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Department “${selectedDepartment?.name}”.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {isError ? (
            <EmptyState
              title="Could not fetch Departments"
              subTitle="Check your internet connection"
            />
          ) : null}
          {!departments?.length ? (
            <EmptyState
              title="No Departments found"
              subTitle="Departments will appear here after you add them in your school."
            />
          ) : null}
          {departments?.map((department: Department) => (
            <TableRow
              key={department.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
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
                <IconButton onClick={() => handleOpenModal(department, "edit")}>
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
    </TableContainer>
  );
};

export default DepartmentList;
