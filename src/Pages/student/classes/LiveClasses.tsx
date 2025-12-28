import {
  Box,
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Grid,
  Pagination,
  Stack,
} from "@mui/material";
import { ArrowForward, Quiz } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName, setPageLoading } from "../../../store/app.slice";
import { selectCurrentUser } from "../../../store/auth.slice";
import EmptyState from "../../../components/EmptyState";
import LiveClassCard from "./LiveClassCard";
import { useGetLiveClassesQuery } from "../../../store/api/liveClass.api";
import { useGetCurrentSemesterQuery } from "../../../store/api/semesters.api";
import { useGetCurrentSessionQuery } from "../../../store/api/sessions.api";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import dayjs from "dayjs";

const LiveClasses = () => {
  const dispatch = useAppDispatch();
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [page, setPage] = useState(1);

  // Set page name
  useEffect(() => {
    dispatch(setPageName("Live Classes"));
  }, [dispatch]);

  // Get current user
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0;

  // Fetch participant data to get courses
  const { data: participantData, isLoading: isParticipantLoading } =
    useGetParticipantQuery(participantId);

  // Fetch current semester and session
  const { data: currentSemester, isLoading: isSemesterLoading } =
    useGetCurrentSemesterQuery(null);
  const { data: currentSession, isLoading: isSessionLoading } =
    useGetCurrentSessionQuery(null);

  // Fetch live classes with current semester, session, and pagination
  const { data: liveClasses, isFetching } = useGetLiveClassesQuery(
    {
      course_id: selectedCourse?.id ? String(selectedCourse.id) : "",
      semester: currentSemester?.data?.name || "",
      session: currentSession?.data?.name || "",
      page: page,
      per_page: 10, // Adjust this value based on your needs
    },
    {
      // Skip the query if we don't have semester, session, participant data, or selected course
      skip:
        !currentSemester?.data?.name ||
        !currentSession?.data?.name ||
        !participantData?.data ||
        !selectedCourse,
    }
  );

const processClassStatus = (liveClass: {
  start_time: string;
  duration: number;
}) => {
  const startTime = dayjs(liveClass.start_time);
  const earlyStartTime = startTime.subtract(5, "minute");
  const endTime = startTime.add(liveClass.duration, "minute");
  const now = dayjs();

  if (now.isAfter(endTime)) {
    return "Completed";
  } else if (now.isAfter(earlyStartTime)) {
    return "Ongoing";
  } else {
    return "Not Started";
  }
};

  // Handle page change
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    // Simulate loading delay
    
  };

  // Update loading state when selected course changes
  useEffect(() => {
    setPage(1); // Reset to first page when course changes
    
  }, [selectedCourse]);

  // Combined loading state
  const isFullyLoaded =
    !isParticipantLoading &&
    !isSemesterLoading &&
    !isSessionLoading &&
    !isFetching

  useEffect(() => {
    if (!isFullyLoaded) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isFullyLoaded, dispatch]);

  return (
    <Box className="content-container">
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: "240px" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Courses
            </Typography>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {participantData?.data?.courses?.map((course) => (
                <React.Fragment key={course.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() =>
                        setSelectedCourse({
                          id: course?.id || 0,
                          name: course.name,
                        })
                      }
                      sx={{
                        py: 2,
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Quiz color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={course.name}
                        primaryTypographyProps={{
                          fontWeight:
                            selectedCourse?.id === course.id ? 700 : 500,
                        }}
                      />
                      {selectedCourse?.id === course.id && (
                        <ArrowForward sx={{ color: "text.secondary" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ bgcolor: "#fff" }}>
              {!currentSemester?.data ||
                !currentSession?.data ||
                !selectedCourse ? (
                <EmptyState
                  title="No course selected"
                  subTitle="Please select a course"
                />
              ) : liveClasses?.data?.length ? (
                <Box sx={{ width: "100%", height: "100%" }}>
                  <Grid2 container spacing={2}>
                    {liveClasses.data.map((item) => {
                      const status = processClassStatus(item);
                      return (
                        <Grid
                          key={item.id}
                          xs={12}
                          sm={6}
                          md={4}
                          sx={{
                            border: "1px solid #CCCCCC",
                            padding: "1em",
                            borderRadius: "10px",
                            backgroundColor:
                              status === "Ongoing"
                                ? "#FFECEC"
                                : status === "Not Started"
                                ? "transparent"
                                : "#ECFFEE",
                          }}
                        >
                          <LiveClassCard
                            title={item.topic}
                            date={dayjs(item.start_time).format("DD MMM YYYY")}
                            time={dayjs(item.start_time).format("hh:mm A")}
                            status={status}
                            btnAction={() =>
                              window.open(item.meeting?.join_url, "_blank")
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid2>

                  {/* Pagination */}
                  <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
                    <Pagination
                      count={liveClasses.pagination.pages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      disabled={isFetching}
                    />
                  </Stack>
                </Box>
              ) : (
                <EmptyState
                  title="No Live Classes Available"
                  subTitle="Wait for an instructor to create a class."
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveClasses;
