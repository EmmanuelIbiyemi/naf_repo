import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TableBody,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import {
  MouseEvent,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import {
  useGenerateResultMutation,
  useGetResultsMMutation,
  useUploadLegacyResultsMutation,
} from "../../../../store/api/results.api";
import { useCheckResultTaskQuery } from "../../../../store/api/result.api";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useGetLevelsMMutation } from "../../../../store/api/levels.api";
import { useGetSessionsQuery } from "../../../../store/api/sessions.api";
import { useGetSemestersQuery } from "../../../../store/api/semesters.api";
import { useAddMediaMutation } from "../../../../store/api/media.api";
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
import {
  LegacyResultUploadPayload,
} from "../../../../types/results";
import { downloadFile } from "../../../../utils/downloadFile";

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
  const [uploadLegacyResults, uploadLegacyState] =
    useUploadLegacyResultsMutation();
  const [uploadFile, uploadFileState] = useAddMediaMutation();
  const [results, setResults] = useState(resultState.data?.data);
  const keyword = useAppSelector(selectKeyword);
  const [openModal, setOpenModal] = useState({
    success: false,
    transcript: false,
    legacyUpload: false,
  });
  const [successContent, setSuccessContent] = useState({
    title: "Updates Successful",
    subTitle: "Results are being generated in the background.",
    infoText: "Please check back later",
  });
  const [legacyUploadError, setLegacyUploadError] = useState<string | null>(
    null
  );
  const [legacyUploadForm, setLegacyUploadForm] =
    useState<LegacyResultUploadPayload>({
      department_id: 0,
      level_id: 0,
      session: "",
      semester: "",
      file_url: "",
    });
  const [legacyUploadSelections, setLegacyUploadSelections] = useState({
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
  });
  const [pendingTask, setPendingTask] = useState<{
    taskId: string;
    type: "generate" | "legacyUpload";
    description: string;
  } | null>(null);
  const [taskPromptOpen, setTaskPromptOpen] = useState(false);
  const [waitingTask, setWaitingTask] = useState<typeof pendingTask>(null);
  const [taskStatusNote, setTaskStatusNote] = useState<string | null>(null);
  const [lastTaskId, setLastTaskId] = useState<string | null>(null);
  const legacyTemplateUrl =
    import.meta.env.VITE_LEGACY_RESULT_TEMPLATE;
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
  const { data: taskStatusData, isFetching: taskStatusLoading } =
    useCheckResultTaskQuery(waitingTask?.taskId || "", {
      skip: !waitingTask,
      pollingInterval: waitingTask ? 4000 : 0,
    });
  //

  const buildTaskCompletionCopy = (
    taskType: "generate" | "legacyUpload",
    result: unknown
  ) => {
    if (typeof result === "string") {
      return { subTitle: result, infoText: undefined };
    }
    if (result && typeof result === "object") {
      const asRecord = result as Record<string, unknown>;
      const message =
        typeof asRecord.message === "string"
          ? asRecord.message
          : taskType === "legacyUpload"
          ? "Offline result upload completed."
          : "Result generation completed.";

      if (taskType === "legacyUpload") {
        const uploaded =
          typeof asRecord.uploaded === "number" ? asRecord.uploaded : null;
        const failed =
          typeof asRecord.failed === "number" ? asRecord.failed : null;
        const infoParts = [];
        if (uploaded !== null) infoParts.push(`Uploaded: ${uploaded}`);
        if (failed !== null) infoParts.push(`Failed: ${failed}`);
        return {
          subTitle: message,
          infoText: infoParts.length ? infoParts.join(" | ") : undefined,
        };
      }

      if (taskType === "generate") {
        const processed =
          typeof asRecord.participants_processed === "number"
            ? asRecord.participants_processed
            : null;
        const semesterCopy =
          typeof asRecord.semester === "string"
            ? asRecord.semester
            : filters.semester;
        const sessionCopy =
          typeof asRecord.session === "string"
            ? asRecord.session
            : filters.session;
        const infoParts = [];
        if (processed !== null)
          infoParts.push(`Participants processed: ${processed}`);
        if (semesterCopy && semesterCopy !== "default")
          infoParts.push(`Semester: ${semesterCopy}`);
        if (sessionCopy && sessionCopy !== "default")
          infoParts.push(`Session: ${sessionCopy}`);
        return {
          subTitle: message,
          infoText: infoParts.length ? infoParts.join(" | ") : undefined,
        };
      }
    }

    return {
      subTitle: "Background task completed successfully.",
      infoText: undefined,
    };
  };

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
      uploadLegacyState.isLoading ||
      uploadFileState.isLoading
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
    uploadLegacyState,
    uploadFileState,
  ]);

  useEffect(() => {
    if (!waitingTask || !taskStatusData?.data) return;
    const taskData = taskStatusData.data;

    if (taskData.ready) {
      if (taskData.successful) {
        const copy = buildTaskCompletionCopy(
          waitingTask.type,
          taskData.result
        );
        setSuccessContent({
          title:
            waitingTask.type === "legacyUpload"
              ? "Offline result upload completed"
              : "Results generated",
          subTitle: copy.subTitle,
          infoText: copy.infoText || "",
        });
        setOpenModal((prev) => ({ ...prev, success: true }));
        setWaitingTask(null);
        setTaskStatusNote(null);
        if (filters.program_id) {
          getResults(filters).unwrap().catch(() => null);
        }
      } else if (taskData.error) {
        setSuccessContent({
          title: "Task failed",
          subTitle: taskData.error,
          infoText: `Task ID: ${waitingTask.taskId}`,
        });
        setOpenModal((prev) => ({ ...prev, success: true }));
        setWaitingTask(null);
        setTaskStatusNote(taskData.error);
      } else if (taskStatusData.status === "failed") {
        setTaskStatusNote("Task failed. Please try again.");
      }
    }
  }, [waitingTask, taskStatusData, buildTaskCompletionCopy, filters, getResults]);

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

  const handleUploadFacultySelect = async (value: number) => {
    setLegacyUploadSelections((prev) => ({
      ...prev,
      faculty_id: value,
      department_id: 0,
      program_id: 0,
    }));
    setLegacyUploadForm((prev) => ({
      ...prev,
      department_id: 0,
      level_id: 0,
    }));
    if (value) {
      try {
        await getDepartments({ faculty_id: value, page: 1, per_page: 1000 });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUploadDepartmentSelect = async (value: number) => {
    setLegacyUploadSelections((prev) => ({
      ...prev,
      department_id: value,
      program_id: 0,
    }));
    setLegacyUploadForm((prev) => ({
      ...prev,
      department_id: value,
      level_id: 0,
    }));
    if (value) {
      try {
        await getPrograms({ department_id: value, page: 1, per_page: 1000 });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUploadProgramSelect = async (value: number) => {
    setLegacyUploadSelections((prev) => ({ ...prev, program_id: value }));
    setLegacyUploadForm((prev) => ({ ...prev, level_id: 0 }));
    if (value) {
      try {
        await getLevels({ program_id: value });
      } catch (error) {
        console.log(error);
      }
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
    if (!filters.program_id) return;
    try {
      const res = await generateResults(filters).unwrap();
      const taskId = res?.data?.task_id;
      if (taskId) {
        setPendingTask({
          taskId,
          type: "generate",
          description: "Result generation",
        });
        setTaskPromptOpen(true);
        setLastTaskId(taskId);
      } else {
        setSuccessContent({
          title: "Updates Successful",
          subTitle: "Results are being generated in the background.",
          infoText: "You can check back later for the status.",
        });
        setOpenModal((prev) => ({ ...prev, success: true }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openLegacyUploadModal = () => {
    setLegacyUploadError(null);
    setLegacyUploadForm({
      department_id: filters.department_id || 0,
      level_id: filters.level_id || 0,
      session: filters.session !== "default" ? (filters.session as string) : "",
      semester:
        filters.semester !== "default" ? (filters.semester as string) : "",
      file_url: "",
    });
    setLegacyUploadSelections({
      faculty_id: filters.faculty_id || 0,
      department_id: filters.department_id || 0,
      program_id: filters.program_id || 0,
    });
    setOpenModal((prev) => ({ ...prev, legacyUpload: true }));
  };

  const handleLegacyUploadField = (
    field: keyof LegacyResultUploadPayload,
    value: string | number
  ) => {
    setLegacyUploadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLegacyUploadFile = async (ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files?.[0]) return;
    try {
      const form = new FormData();
      form.append("file", ev.target.files[0]);
      const response = await uploadFile(form).unwrap();
      const uploadedUrl = response.media?.[0]?.url || "";
      setLegacyUploadForm((prev) => ({ ...prev, file_url: uploadedUrl }));
    } catch (error) {
      setLegacyUploadError("Unable to upload file. Please try again.");
    }
  };

  const handleLegacyUploadSubmit = async () => {
    setLegacyUploadError(null);
    const { department_id, level_id, semester, session, file_url } =
      legacyUploadForm;
    if (!department_id || !level_id || !semester || !session || !file_url) {
      setLegacyUploadError(
        "Department, level, semester, session, and file are required."
      );
      return;
    }
    try {
      const res = await uploadLegacyResults(legacyUploadForm).unwrap();
      const taskId = res?.data?.task_id;
      if (taskId) {
        setPendingTask({
          taskId,
          type: "legacyUpload",
          description: "Offline result upload",
        });
        setTaskPromptOpen(true);
        setLastTaskId(taskId);
      } else {
        setSuccessContent({
          title: "Offline result upload started",
          subTitle: "The file is processing in the background.",
          infoText: "You can check back later for the status.",
        });
        setOpenModal((prev) => ({ ...prev, success: true }));
      }
      setOpenModal((prev) => ({
        ...prev,
        legacyUpload: false,
      }));
      setLegacyUploadForm({
        department_id: 0,
        level_id: 0,
        session: "",
        semester: "",
        file_url: "",
      });
      if (filters.program_id) {
        await getResults(filters).unwrap();
      }
    } catch (error: any) {
      setLegacyUploadError(
        error?.data?.message ||
          "Failed to process CSV upload. Please check the file format."
      );
    }
  };

  const handleTaskPromptDecision = (shouldWait: boolean) => {
    if (!pendingTask) return;
    setTaskStatusNote(null);
    setLastTaskId(pendingTask.taskId);
    if (shouldWait) {
      setWaitingTask(pendingTask);
    } else {
      setSuccessContent({
        title: "Background task started",
        subTitle: `${pendingTask.description} will continue running.`,
        infoText: `Task ID: ${pendingTask.taskId}. You can leave and come back later.`,
      });
      setOpenModal((prev) => ({ ...prev, success: true }));
    }
    setPendingTask(null);
    setTaskPromptOpen(false);
  };

  const handleStopWaiting = () => {
    if (waitingTask) {
      setSuccessContent({
        title: "Still processing",
        subTitle: `${waitingTask.description} is still running in the background.`,
        infoText: `Task ID: ${waitingTask.taskId}. You can return later to check the status.`,
      });
      setOpenModal((prev) => ({ ...prev, success: true }));
      setLastTaskId(waitingTask.taskId);
    }
    setWaitingTask(null);
    setTaskStatusNote(null);
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
        infoText={successContent.infoText}
        open={openModal.success}
        subTitle={successContent.subTitle}
        title={successContent.title}
      />
      <Dialog
        open={taskPromptOpen && Boolean(pendingTask)}
        onClose={() => {
          if (pendingTask) {
            handleTaskPromptDecision(false);
          } else {
            setTaskPromptOpen(false);
          }
        }}
      >
        <DialogTitle>Wait for this task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingTask?.description} has started in the background (Task ID:
            {pendingTask?.taskId ? ` ${pendingTask.taskId}` : " pending"}).
            Would you like to wait here while we poll for completion, or close
            this and come back later?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleTaskPromptDecision(false)}>
            Come back later
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTaskPromptDecision(true)}
          >
            Wait here
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(waitingTask)}
        onClose={handleStopWaiting}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {waitingTask?.description || "Background task"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              We are checking the task status. You can stop waiting and return
              later at any time.
            </DialogContentText>
            <Alert severity={taskStatusNote ? "error" : "info"}>
              Status: {taskStatusData?.data?.state || "PENDING"}
            </Alert>
            <Typography variant="body2">
              Task ID: {waitingTask?.taskId || lastTaskId || "Unavailable"}
            </Typography>
            {taskStatusLoading ? (
              <DialogContentText>Checking for updates...</DialogContentText>
            ) : null}
            {taskStatusNote ? (
              <Alert severity="error">{taskStatusNote}</Alert>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStopWaiting} color="inherit">
            Stop waiting
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openModal.legacyUpload}
        onClose={() => {
          setLegacyUploadError(null);
          setOpenModal((prev) => ({ ...prev, legacyUpload: false }));
        }}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Upload Offline Results (CSV/XLSX)</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload one Excel file per semester/level. Use the template: one sheet per student, rows per course. Summary/GPA will be computed automatically.
          </Typography>
          {legacyUploadError ? (
            <Alert severity="error">{legacyUploadError}</Alert>
          ) : null}
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Faculty"
                value={legacyUploadSelections.faculty_id || ""}
                onChange={(e) =>
                  handleUploadFacultySelect(Number(e.target.value))
                }
                fullWidth
                size="small"
              >
                <MenuItem value="">Faculty</MenuItem>
                {faculties?.data.map((fac) => (
                  <MenuItem key={fac.id} value={fac.id}>
                    {fac.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Department"
                value={legacyUploadForm.department_id || ""}
                onChange={(e) =>
                  handleUploadDepartmentSelect(Number(e.target.value))
                }
                fullWidth
                size="small"
              >
                <MenuItem value="">Department</MenuItem>
                {departmentsState.data?.data.map((dep) => (
                  <MenuItem key={dep.id} value={dep.id}>
                    {dep.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Program"
                value={legacyUploadSelections.program_id || ""}
                onChange={(e) =>
                  handleUploadProgramSelect(Number(e.target.value))
                }
                fullWidth
                size="small"
              >
                <MenuItem value="">Program</MenuItem>
                {programsState.data?.data.map((prog) => (
                  <MenuItem key={prog.id} value={prog.id}>
                    {prog.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Level"
                value={legacyUploadForm.level_id || ""}
                onChange={(e) =>
                  handleLegacyUploadField("level_id", Number(e.target.value))
                }
                fullWidth
                size="small"
              >
                <MenuItem value="">Level</MenuItem>
                {levelsState.data?.data.map((lvl) => (
                  <MenuItem key={lvl.id} value={lvl.id}>
                    {lvl.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Session"
                value={legacyUploadForm.session}
                onChange={(e) =>
                  handleLegacyUploadField("session", e.target.value)
                }
                fullWidth
                size="small"
              >
                <MenuItem value="">Session</MenuItem>
                {sessions?.data.map((session) => (
                  <MenuItem key={session.name} value={session.name}>
                    {session.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Semester"
                value={legacyUploadForm.semester}
                onChange={(e) =>
                  handleLegacyUploadField("semester", e.target.value)
                }
                fullWidth
                size="small"
              >
                <MenuItem value="">Semester</MenuItem>
                {semesters?.data.map((semester) => (
                  <MenuItem key={semester.name} value={semester.name}>
                    {semester.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Upload Excel</Typography>
              <Button
                variant="outlined"
                component="label"
                disabled={uploadFileState.isLoading}
              >
                {legacyUploadForm.file_url ? "Replace File" : "Choose File"}
                <input
                  type="file"
                  hidden
                  accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleLegacyUploadFile}
                />
              </Button>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="text"
                  onClick={() =>
                    downloadFile(legacyTemplateUrl, "legacy_results_template.xlsx")
                  }
                >
                  Download Template
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Includes per-student sheets; you can duplicate a sheet per student.
                </Typography>
              </Stack>
              {legacyUploadForm.file_url ? (
                <Typography variant="body2" color="success.main">
                  File uploaded and ready to process.
                </Typography>
              ) : null}
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Button
              onClick={() =>
                setOpenModal((prev) => ({ ...prev, legacyUpload: false }))
              }
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleLegacyUploadSubmit}
              disabled={uploadLegacyState.isLoading}
            >
              {uploadLegacyState.isLoading ? "Processing..." : "Upload"}
            </Button>
          </Stack>
        </Box>
      </Dialog>
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
          <Button onClick={openLegacyUploadModal} variant="outlined">
            Upload Offline Result
          </Button>
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
                    <Grid container spacing={3} sx={{ mb: 3 }}>
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
                    </Grid>

                    {/* Student Info */}
                    {pageIndex === 0 && (
                      <Box>
                        <Grid container spacing={3} sx={{ mb: 3 }}>
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
                        </Grid>
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
