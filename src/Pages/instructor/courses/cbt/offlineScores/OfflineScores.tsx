import { Box } from "@mui/material";
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
import InstructorPageHeader from "../../../../../components/layout/InstructorPageHeader";

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
      <InstructorPageHeader
        heading="Manage Scores"
        subHeading="Easily add, edit, and track scores for offline activities, ensuring accurate performance records."
        button={{
          text: "Update Record",
          action: handleOpenRecordModal,
        }}
        additionalButton={{
          text: "Add New Record",
          action: handleOpen,
          isLoading: !selectedCourse,
        }}
      />

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
