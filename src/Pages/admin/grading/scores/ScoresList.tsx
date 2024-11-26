import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ScoreFormAction, Score } from "../../../../types/scores";
import {
  Box,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableHead,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteScoreMutation,
  useGetScoresQuery,
  useUpdateScoreMutation,
} from "../../../../store/api/scores.api";
import FormModal from "../../../../components/FormModal";
import ScoreForm from "./ScoresForm";
import SuccessModal from "../../../../components/SuccessModal";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useAppSelector } from "../../../../store/hooks";
import { selectKeyword } from "../../../../store/app.slice";

const ScoresList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedScore, setSelectedScore] = useState<Score>();
  const [deleteScore] = useDeleteScoreMutation();
  const [updateScore] = useUpdateScoreMutation();
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
  const { data: scrs } = useGetScoresQuery(filters.program_id);
  const [scores, setScores] = useState(scrs?.data);
  const keyword = useAppSelector(selectKeyword);

  useEffect(() => {
    if (keyword && scrs?.data)
      setScores(
        scrs.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setScores(scrs?.data);
  }, [keyword, scrs]);

  const handleOpenModal = (score: Score, type: string) => {
    setSelectedScore(score);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedScore(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (score_id: number) => {
    try {
      await deleteScore(score_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditScore = async (score: Score) => {
    try {
      await updateScore(score).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(score, "success");
  };

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
      {/* EDIT */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <ScoreForm
          actions={{
            submit: handleEditScore as ScoreFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          score={selectedScore}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedScore) handleDelete(selectedScore.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action"
        open={openModal.delete}
        subTitle={`Are you sure you want to delete the score with name "${selectedScore?.name}" ?`}
        title="Delete Score?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedScore(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully updated the score with name "${selectedScore?.name}".`}
        title="Update Successful"
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
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
            }}
          >
            <TableCell component="th" scope="row">
              Name
            </TableCell>
            <TableCell>Min Score</TableCell>
            <TableCell>Max Score</TableCell>
            <TableCell>Remark</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!scores?.length ? (
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
          {scores?.map((score: Score) => (
            <TableRow
              key={score.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link to={`/scores/${score.id}`}>{score.name}</Link>
              </TableCell>
              <TableCell>{score.min_score}</TableCell>
              <TableCell>{score.max_score}</TableCell>
              <TableCell>{score.remark}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleOpenModal(score, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(score, "delete")}>
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

export default ScoresList;
