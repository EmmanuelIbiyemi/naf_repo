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
import { useGetStudentTranscriptQuery } from "../../../../store/api/result.api";
import { StudentType } from "../../../../types/students";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { chunk } from "lodash";
import { StudentTranscriptResponse } from "../../../../types/transcript";

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

  //
  const { data: transcriptData } = useGetStudentTranscriptQuery(
    selectedStudent?.id as number,
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
    setOpenModal((prev) => ({ ...prev, success: true }));
  };

  // To be updated
  const handleDownload = async (event: MouseEvent<HTMLButtonElement>) => {
    // Hide the button before printing
    (event.target as HTMLButtonElement).style.opacity = "0";

    const resultContent = resultContentRef.current;
    if (!resultContent) return;

    try {
      // Find all elements with the className "transcript-page"
      const pages = resultContent.querySelectorAll(".transcript-page");
      if (pages.length === 0) {
        alert("No pages found to generate the PDF.");
        return;
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Use html2canvas to capture each page
        const canvas = await html2canvas(page as HTMLElement, {
          useCORS: true,
          logging: false,
          svgRendering: true,
        });

        // Convert canvas to image data
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      // Save the PDF
      pdf.save(
        `Result_${
          transcriptData?.data?.[0]?.participant?.matric_number || "Unknown"
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }

    // Restore button visibility after printing
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

      {transcriptData?.data ? (
        <Dialog
          open={openModal.transcript}
          onClose={() =>
            setOpenModal((prev) => ({ ...prev, transcript: false }))
          }
          scroll="body"
          sx={{ ".MuiPaper-root": { maxWidth: "100% !important" } }}
        >
          <Box ref={resultContentRef} sx={{ width: "800px" }}>
            {/* Student Information Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                mt: "2rem",
                mr: "2rem",
              }}
            >
              <Button variant="outlined" onClick={handleDownload}>
                Download Transcript
              </Button>
            </Box>
            {transcriptData.data.map((tr) => {
              const courseChunks = tr.details?.length
                ? chunk(tr.details, 12)
                : [[]]; // Split courses into chunks or set a single empty chunk

              return courseChunks.map(
                (
                  courseChunk: StudentTranscriptResponse["data"][0]["details"],
                  pageIndex: number
                ) => (
                  <Box
                    key={`${tr.participant?.matric_number}-${pageIndex}`}
                    className="transcript-page"
                    sx={{ py: 4, px: 4 }}
                  >
                    {/* Header */}
                    <Grid2 container spacing={3} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          backgroundColor: "white",
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

                    {/* Student Info */}
                    {pageIndex === 0 && (
                      <Box>
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
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                MATRIC NUMBER:{" "}
                                {tr.participant?.matric_number || "Unassigned"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                FULL NAME:{" "}
                                {`${tr.participant?.first_name || ""} ${
                                  tr.participant?.last_name || ""
                                }`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                SEMESTER: {tr.semester || "N/A"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                LEVEL: {tr.level?.name || "N/A"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                SESSION: {tr.session || "N/A"}
                              </Typography>
                            </Box>
                            <Avatar
                              src={tr.participant?.photo || ""}
                              sx={{ width: 128, height: 128 }}
                            />
                          </Box>
                        </Grid2>
                      </Box>
                    )}

                    {/* Courses Table or No Courses Message */}
                    {courseChunk.length ? (
                      <TableContainer
                        component={Paper}
                        sx={tableContainerStyle}
                      >
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
                            {courseChunk.map((course, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {index + 1 + pageIndex * 12}
                                </TableCell>
                                <TableCell>{course.course_code}</TableCell>
                                <TableCell>{course.course_name}</TableCell>
                                <TableCell>
                                  {course.course_credit_unit}
                                </TableCell>
                                <TableCell>
                                  {course.total_obtained_score}
                                </TableCell>
                                <TableCell>{course.score_name}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        No courses found for this transcript.
                      </Typography>
                    )}

                    {/* Footer */}
                    {pageIndex === courseChunks.length - 1 && (
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
                            {tr.summary?.total_credit_units || "N/A"}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Cumulative TCU:{" "}
                            {tr.summary?.total_credit_units || "N/A"}
                          </Typography>
                        </Box>
                        <Box sx={gpaSectionStyle}>
                          <Typography variant="body1" color="textSecondary">
                            Total Credit Points (TCP):{" "}
                            {tr.summary?.total_grade_points || "N/A"}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Cumulative TCP:{" "}
                            {tr.summary?.total_grade_points || "N/A"}
                          </Typography>
                        </Box>
                        <Box sx={gpaSectionStyle}>
                          <Typography variant="body1" color="textSecondary">
                            Grade Point Average (GPA):{" "}
                            {tr.summary?.grade_point_average || "N/A"}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            CGPA:{" "}
                            {tr.summary?.cumulative_grade_point_average ||
                              "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )
              );
            })}

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

// const courseChunks = chunk(
//   [
//     ...tr.details,
//     ...tr.details,
//     ...tr.details,
//     ...tr.details,
//     ...tr.details,
//   ],
//   12
// ); // Split courses into chunks of 12
