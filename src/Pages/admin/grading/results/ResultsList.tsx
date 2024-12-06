import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  FormControl,
  Grid2,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import { MouseEvent, useEffect, useRef, useState } from "react";
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
import { RemoveRedEye } from "@mui/icons-material";
import { useStudentResultQuery } from "../../../../store/api/result.api";
import { StudentType } from "../../../../types/students";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [openModal, setOpenModal] = useState({
    success: false,
    transcript: false,
  });
  const dispatch = useAppDispatch();

  //
  const resultContentRef = useRef<HTMLDivElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null
  );
  const { data: resultData, isLoading: isLoadingResults } =
    useStudentResultQuery(
      {
        participant_id: selectedStudent?.id as number,
        session: filters.session,
        semester: filters.semester,
      },
      {
        skip: !selectedStudent,
      }
    );
  //

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
      semesterIsLoading ||
      isLoadingResults
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [
    resultState,
    resultData,
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
    setOpenModal((prev) => ({ ...prev, success: true }));
  };

  // To be updated
  const handleDownload = async (event: MouseEvent<HTMLButtonElement>) => {
    // hide button before printing
    (event.target as HTMLButtonElement).style.opacity = "0";

    const resultContent = resultContentRef.current;
    if (!resultContent) return;

    try {
      // Use html2canvas to capture the result content
      const canvas = await html2canvas(resultContent, {
        useCORS: true,
        logging: false,
      });

      // Convert canvas to PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(
        `Result_${
          resultData?.data?.participant?.matric_number || "Unknown"
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
    (event.target as HTMLButtonElement).style.opacity = "1";
  };

  return (
    <TableContainer>
      {/* Success */}
      <SuccessModal
        close={() => {
          setOpenModal((prev) => ({ ...prev, success: false }));
        }}
        infoText="Please check back later"
        open={openModal.success}
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
                  onClick={() => {
                    setSelectedStudent({
                      ...result.participant,
                      courses: [],
                    } as StudentType);
                    setOpenModal((prev) => ({ ...prev, transcript: true }));
                  }}
                >
                  <RemoveRedEye />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* RESULT CONTAINER */}

      {resultData?.data ? (
        <Dialog
          open={openModal.transcript}
          onClose={() =>
            setOpenModal((prev) => ({ ...prev, transcript: false }))
          }
          scroll="body"
          sx={{ ".MuiPaper-root": { maxWidth: "100% !important" } }}
        >
          <Box ref={resultContentRef} sx={{ py: 8, px: 4, width: "800px" }}>
            {/* Student Information Section */}
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button variant="outlined" onClick={handleDownload}>
                Download Transcript
              </Button>
            </Box>
            <Grid2 container spacing={3} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "white",
                  // px: 8,
                  py: 2,
                }}
              >
                <img
                  src={import.meta.env.VITE_LOGO}
                  alt="school logo"
                  style={{ width: 80 }}
                />
                <h1>
                  {import.meta.env.VITE_SCHOOL_NAME.split(" ").map(
                    (word: string) => word[0]
                  )}
                </h1>
                <h2>Student Result</h2>
              </Box>
            </Grid2>

            <Grid2 container spacing={3} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "white",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="caption" color="textSecondary">
                    MATRIC NUMBER:{" "}
                    {resultData?.data?.participant?.matric_number ||
                      "Unassigned"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    FULL NAME:{" "}
                    {`${resultData?.data?.participant?.first_name || ""} ${
                      resultData?.data?.participant?.last_name || ""
                    }`}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    SEMESTER: {resultData?.data?.semester || "N/A" + " "}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    LEVEL: {resultData?.data?.level?.name || "N/A" + " "}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    SESSION: {resultData?.data?.session || "N/A"}
                  </Typography>
                </Box>
                <Avatar
                  src={resultData?.data.participant?.photo || ""}
                  sx={{
                    width: 128,
                    height: 128,
                    marginBottom: "1rem",
                  }}
                />
              </Box>
            </Grid2>

            {/* Courses Table */}
            <TableContainer component={Paper} sx={tableContainerStyle}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S/N</TableCell>
                    <TableCell>COURSE CODE</TableCell>
                    <TableCell>COURSE TITLE</TableCell>
                    <TableCell>UNITS</TableCell>
                    <TableCell>SCORE</TableCell>
                    <TableCell>GRADE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultData?.data?.details?.length ? (
                    resultData.data.details.map((course, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{course.course_code}</TableCell>
                        <TableCell>{course.course_name}</TableCell>
                        <TableCell>{course.course_credit_unit}</TableCell>
                        <TableCell>{course.total_obtained_score}</TableCell>
                        <TableCell>{course.score_name}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No courses found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Footer with GPA */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                backgroundColor: "white",
                p: 2,
              }}
            >
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Total Credit Units (TCU):{" "}
                  {resultData?.data?.summary?.total_credit_units || "N/A"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Cumulative TCU:{" "}
                  {resultData?.data?.summary?.total_credit_units || "N/A"}
                </Typography>
              </Box>
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Total Credit Points (TCP):{" "}
                  {resultData?.data?.summary?.total_grade_points || "N/A"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Cumulative TCP:{" "}
                  {resultData?.data?.summary?.total_grade_points || "N/A"}
                </Typography>
              </Box>
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Grade Point Average (GPA):{" "}
                  {resultData?.data?.summary?.grade_point_average || "N/A"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  CGPA:{" "}
                  {resultData?.data?.summary?.cumulative_grade_point_average ||
                    "N/A"}
                </Typography>
              </Box>
            </Box>

            {/* Footer Section */}
          </Box>
        </Dialog>
      ) : null}
    </TableContainer>
  );
};

export default ResultsList;

const tableContainerStyle = {
  borderRadius: "var(--border-radius)",
  boxShadow: 1,
};

const gpaSectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};
