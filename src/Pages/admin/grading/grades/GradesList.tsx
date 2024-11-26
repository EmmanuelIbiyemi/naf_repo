import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  IconButton,
  Select,
  Box,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  TableHead,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import FormModal from "../../../../components/FormModal";
import GradeForm from "./GradesForm";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useDeleteGradeMutation,
  useGetGradesQuery,
  useUpdateGradeMutation,
} from "../../../../store/api/grades.api";

import { Grade, GradeFormAction } from "../../../../types/grades";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useAppSelector } from "../../../../store/hooks";
import { selectKeyword } from "../../../../store/app.slice";

const GradesList: React.FC = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedGrade, setSelectedGrade] = useState<Grade>();
  const [deleteGrade] = useDeleteGradeMutation();
  const [updateGrade] = useUpdateGradeMutation();
  const { data: faculties } = useGetFacultiesQuery({
    page: 1,
    per_page: 1000,
  });
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [filters, setFilters] = useState({
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
  });
  const { data: grds, isLoading } = useGetGradesQuery(filters.program_id);
  const [grades, setGrades] = useState(grds?.data);
  const keyword = useAppSelector(selectKeyword);

  useEffect(() => {
    if (keyword && grds?.data)
      setGrades(
        grds.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setGrades(grds?.data);
  }, [keyword, grds]);

  const handleOpenModal = (grade: Grade, type: string) => {
    setSelectedGrade(grade);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedGrade(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (grade_id: number) => {
    try {
      await deleteGrade(grade_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditGrade = async (grade: Grade) => {
    try {
      await updateGrade(grade).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(grade, "success");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleChange = async (e: SelectChangeEvent<number>) => {
    const { target } = e;

    setFilters((prev) => ({ ...prev, [target.name]: +target.value }));
    try {
      if (target.name === "faculty_id") {
        await getDepartments({
          faculty_id: +target.value,
          page: 1,
          per_page: 1000,
        }).unwrap();
      } else if (target.name === "department_id") {
        await getPrograms({
          department_id: +target.value,
          page: 1,
          per_page: 1000,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TableContainer>
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <GradeForm
          actions={{
            submit: handleEditGrade as GradeFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          grade={selectedGrade}
        />
      </FormModal>

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedGrade?.id) handleDelete(selectedGrade.id);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can't undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Grade "${selectedGrade?.name}" ?`}
        title="Delete Grade?"
      />

      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedGrade(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully updated the Grade "${selectedGrade?.name}".`}
        title="Updates Successful"
      />

      <Box
        sx={{
          ".MuiSelect-select": { padding: ".5rem", maxWidth: "200px" },
          "td.MuiTableCell-body": {
            "&:last-child td, &:last-child th": { border: 0 },
            padding: 0,
          },
        }}
      >
        <Box sx={{ display: "flex", gap: ".5em", marginBottom: "2rem" }}>
          <FormControl>
            <Select
              value={filters.faculty_id}
              onChange={handleChange}
              name="faculty_id"
            >
              <MenuItem value={0}>select faculty</MenuItem>
              {faculties?.data.map((fac) => (
                <MenuItem key={fac.name} value={fac.id}>
                  {fac.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Select
              value={filters.department_id}
              onChange={handleChange}
              name="department_id"
            >
              <MenuItem value={0}>select department</MenuItem>
              {departmentsState.data?.data.map((dep) => (
                <MenuItem key={dep.name} value={dep.id}>
                  {dep.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Select
              value={filters.program_id}
              onChange={handleChange}
              name="program_id"
            >
              <MenuItem value={0}>select program</MenuItem>
              {programsState.data?.data.map((dep) => (
                <MenuItem key={dep.name} value={dep.id}>
                  {dep.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Table
        sx={{
          minWidth: 650,
          ".MuiSelect-select": { padding: ".5rem", maxWidth: "200px" },
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              "td.MuiTableCell-body": {
                padding: 0,
              },
            }}
          >
            <TableCell
              component="th"
              scope="row"
              sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
            >
              Name
            </TableCell>
            <TableCell align="right">Point</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!grades?.length ? (
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
          {grades?.map((grade: Grade) => (
            <TableRow
              key={grade.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "td.MuiTableCell-body": {
                  padding: 0,
                },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/grades/${grade.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {grade.name}
                </Link>
              </TableCell>
              <TableCell align="right">{grade.point}</TableCell>
              <TableCell align="right">{grade.program_id}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(grade, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(grade, "delete")}>
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

export default GradesList;
