import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableHead,
} from "@mui/material";
import { useState } from "react";
import { useGetResultsMMutation } from "../../../../store/api/results.api";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useGetLevelsMMutation } from "../../../../store/api/levels.api";
import { useGetSessionsQuery } from "../../../../store/api/sessions.api";
import { useGetSemestersQuery } from "../../../../store/api/semesters.api";

const ResultsList = () => {
  const { data: faculties } = useGetFacultiesQuery(null);
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [getLevels, levelsState] = useGetLevelsMMutation();
  const { data: sessions } = useGetSessionsQuery(null);
  const { data: semesters } = useGetSemestersQuery(null);
  const [filters, setFilters] = useState({
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
    level_id: 0,
    session: "",
    semester: "",
  });
  // const [getResults, resultState] = useGetResultsMMutation();
  const [getResults] = useGetResultsMMutation();

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
        await getDepartments(+target.value).unwrap();
      } else if (target.name === "department_id") {
        await getPrograms(+target.value).unwrap();
      } else if (target.name === "program_id") {
        await getLevels(+target.value).unwrap();
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

  return (
    <TableContainer>
      <Box
        sx={{
          ".MuiSelect-select,.MuiInputBase-input,.MuiButton-root": {
            padding: ".5rem",
            maxWidth: "100px",
          },
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
              <MenuItem value={""}>session</MenuItem>
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
              <MenuItem value={""}>semester</MenuItem>
              {semesters?.data.map((semester) => (
                <MenuItem key={semester.name} value={semester.name}>
                  {semester.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={fetchResults} variant="contained">
            Get
          </Button>
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
              Previous GPA
            </TableCell>
            <TableCell component="th" scope="row">
              Cummulative GPA
            </TableCell>
            <TableCell component="th" scope="row">
              Remark
            </TableCell>
          </TableRow>
        </TableHead>
        {/* {results?.data.length ? (
            <TableBody>
              {results?.data.map((result: Result) => (
                <TableRow
                  key={result.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Link to={`/results/${result.id}`}>{result.name}</Link>
                  </TableCell>
                  <TableCell>{result.remark}</TableCell>
                  <TableCell>{result.remark}</TableCell>
                  <TableCell>{result.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <Box>No results found.</Box>
          )} */}
      </Table>
    </TableContainer>
  );
};

export default ResultsList;
