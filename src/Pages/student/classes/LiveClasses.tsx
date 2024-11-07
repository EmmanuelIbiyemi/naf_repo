import {
  Box,
  Grid2,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { ArrowForward, Quiz } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { selectCurrentUser } from "../../../store/auth.slice";
import EmptyState from "../../../components/EmptyState";
import LiveClassCard from "./LiveClassCard";
import { useGetLiveClassesQuery } from "../../../store/api/liveClass.api";
import { useGetCurrentSemesterQuery } from "../../../store/api/semesters.api";
import { useGetCurrentSessionQuery } from "../../../store/api/sessions.api";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import dayjs from "dayjs";

const LiveClasses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    name: string;
  } | null>(null);

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

  // Fetch live classes with current semester and session
  const { data: liveClasses, isLoading: isClassesLoading } =
    useGetLiveClassesQuery(
      {
        course_id: selectedCourse?.id ? String(selectedCourse.id) : "",
        semester: currentSemester?.data?.name || "",
        session: currentSession?.data?.name || "",
      },
      {
        // Skip the query if we don't have semester, session, or participant data yet
        skip:
          !currentSemester?.data?.name ||
          !currentSession?.data?.name ||
          !participantData?.data,
      }
    );

  // Process live classes data
  const processClassStatus = (liveClass: { start_time: string }) => {
    const startTime = dayjs(liveClass.start_time);
    const now = dayjs();
    const diffMinutes = startTime.diff(now, "minute");

    if (diffMinutes < -120) return "Completed";
    if (diffMinutes === 0) return "Ongoing";
    if (diffMinutes <= 60) return `Starting in ${diffMinutes} Minutes`;
    return "Not Started";
  };

  // Combined loading state
  const isLoading =
    isParticipantLoading ||
    isSemesterLoading ||
    isSessionLoading ||
    isClassesLoading;

  return (
    <Box ref={containerRef} className="content-container">
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: "300px" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Courses
            </Typography>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setSelectedCourse(null)}
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
                    primary="All Courses"
                    primaryTypographyProps={{
                      fontWeight: selectedCourse === null ? 700 : 500,
                    }}
                  />
                  {selectedCourse === null && (
                    <ArrowForward sx={{ color: "text.secondary" }} />
                  )}
                </ListItemButton>
              </ListItem>
              <Divider />
              {participantData?.data?.courses.map((course) => (
                <React.Fragment key={course.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() =>
                        setSelectedCourse({ id: (course?.id || 0), name: course.name })
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
              {isLoading ? (
                <Box sx={{ p: 3, textAlign: "center" }}>Loading...</Box>
              ) : !currentSemester?.data || !currentSession?.data ? (
                <EmptyState
                  title="No Active Semester or Session"
                  subTitle="Please set up the current semester and session."
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
                            batchNo={`Course ID: ${item.course_id}`}
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
