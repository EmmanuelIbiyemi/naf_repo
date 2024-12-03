import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableBody,
  TableHead,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useGenerateResultMutation,
  useGetResultsMMutation,
} from "../../../../store/api/results.api";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useGetLevelsMMutation } from "../../../../store/api/levels.api";
import { useGetSessionsQuery } from "../../../../store/api/sessions.api";
import { useGetSemestersQuery } from "../../../../store/api/semesters.api";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import SuccessModal from "../../../../components/SuccessModal";
import { Download } from "@mui/icons-material";
import { useGetStudentTranscriptMMutation } from "../../../../store/api/result.api";

const ResultsList = () => {
  const { data: faculties } = useGetFacultiesQuery({
    page: 1,
    per_page: 1000,
  });
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [getLevels, levelsState] = useGetLevelsMMutation();
  const { data: sessions, isFetching: sessionsIsLoading } = useGetSessionsQuery(
    { search_term: "" }
  );
  const { data: semesters, isFetching: semesterIsLoading } =
    useGetSemestersQuery(null);
  const [filters, setFilters] = useState({
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
    level_id: 0,
    session: "default",
    semester: "default",
  });
  const [getResults, resultState] = useGetResultsMMutation();
  const [generateResults, generateState] = useGenerateResultMutation();
  const [results, setResults] = useState(resultState.data?.data);
  const keyword = useAppSelector(selectKeyword);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const [getTranscript] = useGetStudentTranscriptMMutation();

  useEffect(() => {
    if (keyword && resultState.data?.data)
      setResults(
        resultState.data?.data.filter(
          (f) =>
            f.participant.first_name
              .toLowerCase()
              .includes(keyword.toLowerCase()) ||
            f.participant.last_name
              .toLowerCase()
              .includes(keyword.toLowerCase()) ||
            f.participant.email.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setResults(resultState.data?.data);
  }, [keyword, resultState]);

  useEffect(() => {
    if (
      (resultState.isLoading && !resultState.isError) ||
      generateState.isLoading ||
      departmentsState.isLoading ||
      programsState.isLoading ||
      levelsState.isLoading ||
      sessionsIsLoading ||
      semesterIsLoading
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [
    resultState,
    generateState,
    departmentsState,
    programsState,
    levelsState,
    sessions,
    semesters,
  ]);

  const handleChange = async (e: SelectChangeEvent<number | string>) => {
    const { target } = e;
    console.log(target.value);

    setFilters((prev) => ({
      ...prev,
      [target.name]:
        typeof target.value == "number" ? +target.value : target.value,
    }));
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
      } else if (target.name === "program_id") {
        await getLevels({
          program_id: +target.value,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResults = async () => {
    if (filters.program_id) {
      try {
        await getResults(filters).unwrap();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const generateResult = async () => {
    if (filters.program_id) {
      try {
        await generateResults(filters).unwrap();
      } catch (error) {
        console.log(error);
      }
    }
    setOpenModal(true);
  };

  // To be updated
  const downloadTranscript = async (student_id: number) => {
    try {
      await getTranscript(student_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer>
      {/* Success */}
      <SuccessModal
        close={() => {
          setOpenModal(false);
        }}
        infoText="Please check back later"
        open={openModal}
        subTitle={`Results are being generated in the background.`}
        title="Updates Successful"
      />

      <Box
        sx={{
          ".MuiSelect-select": {
            padding: ".5rem",
            maxWidth: "70px",
          },
          "td.MuiTableCell-body": {
            "&:last-child td, &:last-child th": { border: 0 },
            padding: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginBottom: "2rem",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: ".5rem",
          }}
        >
          <Box sx={{ display: "flex", gap: ".5em", flexWrap: "wrap" }}>
            <FormControl>
              <Select
                value={filters.faculty_id}
                onChange={handleChange}
                name="faculty_id"
              >
                <MenuItem value={0}>faculty</MenuItem>
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
                <MenuItem value={0}>department</MenuItem>
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
                <MenuItem value={0}>program</MenuItem>
                {programsState.data?.data.map((dep) => (
                  <MenuItem key={dep.name} value={dep.id}>
                    {dep.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Select
                value={filters.level_id}
                onChange={handleChange}
                name="level_id"
              >
                <MenuItem value={0}>level</MenuItem>
                {levelsState.data?.data.map((lvl) => (
                  <MenuItem key={lvl.name} value={lvl.id}>
                    {lvl.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Select
                value={filters.session}
                onChange={handleChange}
                name="session"
              >
                <MenuItem value="default">session</MenuItem>
                {sessions?.data.map((session) => (
                  <MenuItem key={session.name} value={session.name}>
                    {session.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Select
                value={filters.semester}
                onChange={handleChange}
                name="semester"
              >
                <MenuItem value="default">semester</MenuItem>
                {semesters?.data.map((semester) => (
                  <MenuItem key={semester.name} value={semester.name}>
                    {semester.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: ".5em",

              button: {
                flexShrink: 0,
              },
            }}
          >
            <Button onClick={fetchResults} variant="contained">
              Fetch
            </Button>
            <Button onClick={generateResult} variant="contained">
              Generate
            </Button>
          </Box>
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
              Student ID
            </TableCell>
            <TableCell component="th" scope="row">
              Name
            </TableCell>
            <TableCell component="th" scope="row">
              Level
            </TableCell>
            <TableCell component="th" scope="row">
              Current GPA
            </TableCell>
            <TableCell component="th" scope="row">
              Cummulative GPA
            </TableCell>
            <TableCell component="th" scope="row">
              Remark
            </TableCell>
            <TableCell component="th" scope="row" align="center">
              Transcript
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!results?.length ? (
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
          {results?.map((result) => (
            <TableRow
              key={result.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell>{result.participant.matric_number}</TableCell>
              <TableCell>
                {result.participant.first_name} {result.participant.last_name}
              </TableCell>
              <TableCell>{result.level.name}</TableCell>
              <TableCell>{result.summary.grade_point_average}</TableCell>
              <TableCell>
                {result.summary.cumulative_grade_point_average}
              </TableCell>
              <TableCell>{result.details?.[0].score_remark}</TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() => downloadTranscript(result.participant.id)}
                >
                  <Download />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsList;
