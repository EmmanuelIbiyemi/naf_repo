import {
  Box,
  FormControl,
  Grid2,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SxProps,
  Tab,
} from "@mui/material";
import EmptyState from "../../../components/EmptyState";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LiveClassCard from "./LiveClassCard";
import CreateClassModal from "./CreateClassModal";
import { useGetLiveClassesQuery } from "../../../store/api/classes.api";
import { useGetCurrentSessionQuery } from "../../../store/api/sessions.api";
import { useGetCurrentSemesterQuery } from "../../../store/api/semesters.api";
import { useGetInstructorCoursesQuery } from "../../../store/api/courses.api";
import dayjs from "dayjs";

const LiveClasses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const { data: instructorCourses, isLoading: isLoadingCourses } =
    useGetInstructorCoursesQuery(null);
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
    },
    { skip: !selectedCourseId }
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Live Classes"));
  }, []);

  const [tab, setTab] = useState("1");
  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseChange = (event: any) => {
    setSelectedCourseId(event.target.value);
  };

  const getClassStatus = (startTime: string, duration: number) => {
    const start = dayjs(startTime);
    const end = start.add(duration, "minute");
    const now = dayjs();

    if (now.isBefore(start)) return "Not Started";
    if (now.isAfter(start) && now.isBefore(end)) return "Ongoing";
    return "Ended";
  };

  const ongoingOrNotStartedClasses = scheduledClasses?.data.filter((item) =>
    ["Not Started", "Ongoing"].includes(
      getClassStatus(item.start_time, item.duration)
    )
  );

  const endedClasses = scheduledClasses?.data.filter(
    (item) => getClassStatus(item.start_time, item.duration) === "Ended"
  );

  return (
    <Box ref={containerRef} className="content-container">
      {isLoading ||
        isGettingSemester ||
        isGettingSession ||
        (isLoadingCourses && <LinearProgress />)}
      <InstructorPageHeader
        additionalButton={{
          action: handleOpenCreateModal,
          text: "Create New Class",
        }}
        heading="Live Classes"
        subHeading="List of classes that have been created and shared in the school"
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box sx={{ marginBottom: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="course-select-label">Select Course</InputLabel>
            <Select
              labelId="course-select-label"
              id="course-select"
              value={selectedCourseId}
              label="Select Course"
              onChange={handleCourseChange}
            >
              {instructorCourses?.data.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ backgroundColor: "#fff" }}>
          {scheduledClasses?.data.length ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <TabContext value={tab}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Scheduled Classes" value="1" />
                    <Tab label="Class History" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" sx={TabStyles}>
                  <Grid2 container spacing={2}>
                    {ongoingOrNotStartedClasses?.map((item) => (
                      <Grid2
                        size={4}
                        key={item.id}
                        sx={{
                          border: "1px solid #CCCCCC",
                          padding: "1em",
                          borderRadius: "10px",
                          backgroundColor:
                            getClassStatus(item.start_time, item.duration) ===
                            "Ongoing"
                              ? "#ECFFEE"
                              : getClassStatus(
                                  item.start_time,
                                  item.duration
                                ) === "Not Started"
                              ? "transparent"
                              : "#ECFFEE",
                        }}
                      >
                        <LiveClassCard
                          title={item.topic}
                          date={item.start_time}
                          time={item.start_time}
                          status={getClassStatus(
                            item.start_time,
                            item.duration
                          )}
                          btnAction={() =>
                            window.open(item.meeting.start_url, "_blank")
                          }
                        />
                      </Grid2>
                    ))}
                  </Grid2>
                </TabPanel>
                <TabPanel value="2" sx={TabStyles}>
                  <Grid2 container spacing={2}>
                    {endedClasses?.map((item) => (
                      <Grid2
                        size={4}
                        key={item.id}
                        sx={{
                          border: "1px solid #CCCCCC",
                          padding: "1em",
                          borderRadius: "10px",
                          // width: "100%",
                          backgroundColor: "transparent",
                        }}
                      >
                        <LiveClassCard
                          title={item.topic}
                          date={item.updated_at}
                          time={item.start_time}
                          status="Ended"
                          btnAction={() =>
                            window.open(item.meeting.start_url, "_blank")
                          }
                        />
                      </Grid2>
                    ))}
                  </Grid2>
                </TabPanel>
              </TabContext>
            </Box>
          ) : (
            <EmptyState
              title="Please select a course to continue!"
              subTitle="Choose a course from the dropdown above to view its live classes"
            />
          )}
        </Box>
      </Box>
      <CreateClassModal
        open={openModal}
        handleClose={handleCloseCreateModal}
        refetch={() => refetch}
      />
    </Box>
  );
};

const TabStyles: SxProps = {
  gap: "1rem",
  grid2TemplateColumns: "repeat(4,1fr)",
  width: "100%",
  backgroundColor: "#fff",
};

export default LiveClasses;
