import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
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
  // Typography,
} from "@mui/material";
import { useState } from "react";
// import { useGetResultsQuery } from "../../../store/api/result.api";
// import LoadingScreen from "../../../components/LoadingScreen";
// import { GetResultInput } from "../../../types/results";
import { useGetFacultiesQuery } from "../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../store/api/programmes.api";
import { useGetLevelsMMutation } from "../../../store/api/levels.api";
import { useGetSessionsQuery } from "../../../store/api/sessions.api";
import { useGetSemestersQuery } from "../../../store/api/semesters.api";

const ResultList = () => {
  // const [resultInput, setResultInput] = useState<GetResultInput>({
  //   department_id: 0,
  //   level_id: 0,
  //   semester: "",
  //   session: "",
  // });
  // const { data: results, isLoading, refetch } = useGetResultsQuery(resultInput);
  const [filters, setFilters] = useState({
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
    level_id: 0,
    session: 0,
    semester: 0,
  });
  const { data: faculties } = useGetFacultiesQuery(null);
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [getLevels, levelsState] = useGetLevelsMMutation();
  const { data: sessions } = useGetSessionsQuery(null);
  const { data: semesters } = useGetSemestersQuery(null);

  const handleChange = async (e: SelectChangeEvent<number>) => {
    const { target } = e;

    setFilters((prev) => ({ ...prev, [target.name]: +target.value }));
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

  const handleSubmit = () => {
    // setResultInput({
    //   department_id: filters.department_id,
    //   level_id: filters.level_id,
    //   session:
    //     sessions?.data.find((sm) => sm.id === filters.session)?.name || "",
    //   semester:
    //     semesters?.data.find((sm) => sm.id === filters.semester)?.name || "",
    // });
    // refetch();
  };

  return (
    <TableContainer>
      {/* {[isLoading].some((item) => item) ? (
        <Box sx={{ position: "relative", zIndex: 2000 }}>
          <LoadingScreen />
        </Box>
      ) : null} */}

      <Box
        sx={{
          display: "flex",
          gap: ".5em",
          marginBottom: "2rem",
          ".MuiSelect-select": {
            maxWidth: "80px",
          },
        }}
      >
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
            {levelsState.data?.data.map((dep) => (
              <MenuItem key={dep.name} value={dep.id}>
                {dep.name}
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
            <MenuItem value={0}>session</MenuItem>
            {sessions?.data.map((dep) => (
              <MenuItem key={dep.name} value={dep.id}>
                {dep.name}
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
            <MenuItem value={0}>semester</MenuItem>
            {semesters?.data.map((dep) => (
              <MenuItem key={dep.name} value={dep.id}>
                {dep.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit}>
          Generate
        </Button>
      </Box>
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
            <TableCell>Level</TableCell>
            <TableCell>Current GPA</TableCell>
            <TableCell>Previous GPA</TableCell>
            <TableCell>Cummulative GPA</TableCell>
            <TableCell>Remark</TableCell>
          </TableRow>
        </TableHead>
        {/* <TableBody>
          {results?.data.map((result) => (
            <TableRow
              key={result.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box
                  sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                >
                  <Checkbox />
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
                    onClick={() => handleOpenModal()}
                  >
                    {result} {result.last_name}
                  </Button>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row">
                {result.email}
              </TableCell>
              <TableCell component="th" scope="row">
                {result.phone}
              </TableCell>
              <TableCell component="th" scope="row">
                {result.courses?.map((c) => c.name).join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody> */}
      </Table>
      {/* {!results?.data.length ? (
        <Typography sx={{ marginTop: "2rem" }}>No results found</Typography>
      ) : null} */}
    </TableContainer>
  );
};

export default ResultList;
