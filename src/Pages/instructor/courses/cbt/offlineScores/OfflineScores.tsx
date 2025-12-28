import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../../store/app.slice";
import RecordsItemsList from "./RecordItemsList";
import { useGetRecordQuery } from "../../../../../store/api/records.api";
import AddRecordModal from "./AddRecordModal";
import AddScoresModal from "./AddScoresModal";
import { recordResponse } from "../../../../../types/records";
import { useGetCourseParticipantsQuery } from "../../../../../store/api/participants.api";
import UpdateRecordModal from "./UpdateRecordModal";
import InstructorCourseSelector from "../../../../../components/layout/InstructorCourseSelector";
import { useLocation } from "react-router-dom";

const OfflineScores = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get persisted course ID from localStorage or location state
  const getInitialCourseId = () => {
    const locationState = location.state as { selectedCourseId?: string } | null;
    if (locationState?.selectedCourseId) {
      return locationState.selectedCourseId;
    }
    return localStorage.getItem("lastSelectedCourseId") || "";
  };

  const [selectedCourse, setSelectedCourse] = React.useState(getInitialCourseId);
  const [selectedRecord, setSelectedRecord] =
    React.useState<recordResponse | null>(null);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openRecordModal, setOpenRecordModal] = React.useState(false);
  const [openScoresModal, setOpenScoresModal] = React.useState(false);

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

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
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

  useEffect(() => {
    if (isFetchingRecords || isFetchingParticipants) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isFetchingRecords, isFetchingParticipants, dispatch]);

  return (
    <Box ref={containerRef} className="content-container">
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
            marginBottom: "1.5em",
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
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              onClick={handleOpen}
              variant="contained"
              disabled={!selectedCourse}
            >
              Add New Record
            </Button>
            <Button
              onClick={handleOpenRecordModal}
              variant="contained"
              disabled={!selectedCourse}
            >
              Update Record
            </Button>
          </Box>
        </Box>

        <InstructorCourseSelector
          selectedCourseId={selectedCourse}
          onCourseChange={handleCourseChange}
          emptyStateTitle="Please select a course"
          emptyStateSubtitle="Choose a course from the dropdown to view and manage scores"
        >
          <Box sx={{ margin: "2em 0" }}>
            <RecordsItemsList
              lists={records?.data || []}
              handleButtonClick={handleOpenScoresModal}
              refetch={refetch}
            />
          </Box>
        </InstructorCourseSelector>
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
  );
};

export default OfflineScores;
