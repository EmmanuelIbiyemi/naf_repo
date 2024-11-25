import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useGetInstructorCoursesQuery } from "../../../../../store/api/courses.api";
import RecordsItemsList from "./RecordItemsList";
import { useGetRecordQuery } from "../../../../../store/api/records.api";
import AddRecordModal from "./AddRecordModal";
import AddScoresModal from "./AddScoresModal";
import { recordResponse } from "../../../../../types/records";
import { useGetCourseParticipantsQuery } from "../../../../../store/api/participants.api";
import UpdateRecordModal from "./UpdateRecordModal";

const OfflineScores = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedRecord, setSelectedRecord] =
    React.useState<recordResponse | null>(null);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openRecordModal, setOpenRecordModal] = React.useState(false);
  const [openScoresModal, setOpenScoresModal] = React.useState(false);
  const { data: courses, isLoading } = useGetInstructorCoursesQuery({
    page: 1,
    per_page: 1000,
  });

  const handleClose = () => setOpenAddModal(false);
  const handleOpen = () => setOpenAddModal(true);

  const handleCloseRecordModal = () => setOpenRecordModal(false);
  const handleOpenRecordModal = () => setOpenRecordModal(true);

  const handleCloseScoresModal = () => {
    setOpenScoresModal(false);
    setSelectedRecord(null);
  };

  const handleOpenScoresModal = (recordItem: recordResponse) => {
    setSelectedRecord(recordItem);
    setOpenScoresModal(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value as string);
  };

  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery(
      { course_id: parseInt(selectedCourse) },
      { skip: !selectedCourse }
    );

  const {
    data: records,
    isLoading: isFetchingRecords,
    refetch,
  } = useGetRecordQuery(
    {
      course_id: parseInt(selectedCourse),
    },
    {
      skip: !selectedCourse,
    }
  );

  useEffect(() => {
    if (selectedCourse) {
      refetch();
    }
  }, [selectedCourse, refetch]);

  return (
    <Box ref={containerRef} className="content-container">
      {(isFetchingRecords || isFetchingParticipants) && <LinearProgress />}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                fontSize: "1.5rem",
                lineHeight: "40.32px",
                marginBottom: ".2em",
              }}
            >
              Manage Scores
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "1rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
              }}
            >
              Easily add, edit, and track scores for offline activities,
              ensuring accurate performance records.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                marginTop: "1em",
                flexDirection: "column",
              }}
            >
              <Typography variant="body2" sx={{}}>
                Select Course
              </Typography>
              <Select
                value={selectedCourse}
                label="course"
                onChange={handleChange}
                sx={{ width: "50%" }}
                disabled={isLoading}
              >
                <MenuItem defaultValue="" disabled>
                  <em>{isLoading ? "Loading" : "None"}</em>
                </MenuItem>
                {courses?.data.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} ({item.code})
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              // sx={{}}
              onClick={handleOpen}
              variant="contained"
              disabled={isLoading || !selectedCourse}
            >
              Add New Record
            </Button>
            <Button
              // sx={{}}
              onClick={handleOpenRecordModal}
              variant="contained"
              disabled={isLoading || !selectedCourse}
            >
              Update Record
            </Button>
          </Box>
        </Box>
        <Box sx={{ margin: "2em 0" }}>
          <RecordsItemsList
            lists={records?.data || []}
            handleButtonClick={handleOpenScoresModal}
            refetch={refetch}
          />
        </Box>
        <AddRecordModal
          open={openAddModal}
          handleClose={handleClose}
          courseId={parseInt(selectedCourse)}
        />
        <UpdateRecordModal
          open={openRecordModal}
          handleClose={handleCloseRecordModal}
          records={records?.data || []}
        />
        <AddScoresModal
          open={openScoresModal}
          handleClose={handleCloseScoresModal}
          recordItem={selectedRecord}
          recordId={selectedRecord?.id ? selectedRecord?.id : null}
          courseParticipants={participants?.data || []}
          refetch={refetch}
          courseId={parseInt(selectedCourse)}
        />
      </Box>
    </Box>
  );
};

export default OfflineScores;
