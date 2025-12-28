import {
  Box,
  Grid2,
} from "@mui/material";
import EmptyState from "../../../components/EmptyState";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import LiveClassCard from "./LiveClassCard";
import CreateClassModal from "./CreateClassModal";
import { useGetLiveClassesQuery } from "../../../store/api/classes.api";
import { useGetCurrentSessionQuery } from "../../../store/api/sessions.api";
import { useGetCurrentSemesterQuery } from "../../../store/api/semesters.api";
import dayjs from "dayjs";
import CustomPagination from "../../../components/CustomPagination";
import { setPageLoading } from "../../../store/app.slice";
import InstructorCourseSelector from "../../../components/layout/InstructorCourseSelector";
import { useLocation } from "react-router-dom";

const LiveClasses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);

  // Get persisted course ID from localStorage or location state
  const getInitialCourseId = () => {
    const locationState = location.state as { selectedCourseId?: string } | null;
    if (locationState?.selectedCourseId) {
      return locationState.selectedCourseId;
    }
    return localStorage.getItem("lastSelectedCourseId") || "";
  };

  const [selectedCourseId, setSelectedCourseId] = useState(getInitialCourseId);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenCreateModal = () => setOpenModal(true);
  const handleCloseCreateModal = () => setOpenModal(false);

  const { data: currentSession, isLoading: isGettingSession } =
    useGetCurrentSessionQuery(null);
  const { data: currentSemester, isLoading: isGettingSemester } =
    useGetCurrentSemesterQuery(null);

  const currentSemesterString = currentSemester?.data.name;
  const currentSessionString = currentSession?.data.name;

  const {
    data: scheduledClasses,
    isLoading,
    refetch,
  } = useGetLiveClassesQuery(
    {
      courseId: parseInt(selectedCourseId),
      semester: currentSemesterString,
      session: currentSessionString,
      page: currentPage,
    },
    { skip: !selectedCourseId }
  );

  const totalItems = scheduledClasses?.pagination?.total || 0;
  // const totalPages = scheduledClasses?.pagination?.pages || 1;
  const itemsPerPage = scheduledClasses?.pagination.per_page || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Live Classes"));
  }, [dispatch]);

  useEffect(() => {
    if (isLoading || isGettingSemester || isGettingSession) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isLoading, isGettingSemester, isGettingSession, dispatch]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage(1); // Reset to first page when changing course
  };

  const getClassStatus = (startTime: string, duration: number) => {
    const start = dayjs(startTime);
    const end = start.add(duration, "minute");
    const now = dayjs();

    if (now.isBefore(start)) return "Not Started";
    if (now.isAfter(start) && now.isBefore(end)) return "Ongoing";
    return "Ended";
  };

  return (
    <Box ref={containerRef} className="content-container">
      <InstructorPageHeader
        additionalButton={{
          action: handleOpenCreateModal,
          text: "Create New Class",
        }}
        heading="Live Classes"
        subHeading="List of classes that have been created and shared in the school"
      />
      
      <InstructorCourseSelector
        selectedCourseId={selectedCourseId}
        onCourseChange={handleCourseChange}
        emptyStateTitle="Please select a course to continue!"
        emptyStateSubtitle="Choose a course from the dropdown above to view its live classes"
      >
        <Box sx={{ backgroundColor: "#fff" }}>
          {scheduledClasses?.data.length ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Grid2 container spacing={2}>
                {scheduledClasses?.data.map((item) => {
                  const status = getClassStatus(item.start_time, item.duration);
                  return (
                    <Grid2
                      size={4}
                      key={item.id}
                      sx={{
                        border: "1px solid #CCCCCC",
                        padding: "1em",
                        borderRadius: "10px",
                        backgroundColor:
                          status === "Ongoing"
                            ? "#ECFFEE"
                            : status === "Not Started"
                            ? "transparent"
                            : "transparent",
                      }}
                    >
                      <LiveClassCard
                        title={item.topic}
                        date={item.start_time}
                        time={item.start_time}
                        status={status}
                        btnAction={() =>
                          window.open(item.meeting.start_url, "_blank")
                        }
                      />
                    </Grid2>
                  );
                })}
              </Grid2>
              <CustomPagination
                startIndex={startIndex + 1}
                endIndex={endIndex}
                totalNumber={totalItems}
                count={Math.ceil(totalItems / itemsPerPage)}
                page={currentPage}
                handleChangePage={handleChangePage}
              />
            </Box>
          ) : (
            <EmptyState
              title="No live classes found"
              subTitle="This course doesn't have any scheduled live classes yet"
            />
          )}
        </Box>
      </InstructorCourseSelector>
      
      <CreateClassModal
        open={openModal}
        handleClose={handleCloseCreateModal}
        refetch={() => refetch}
      />
    </Box>
  );
};

export default LiveClasses;
