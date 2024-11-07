import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import {
  Quiz,
  AccessTime,
  EmojiEvents,
  CalendarToday,
  Assessment,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectCurrentUser } from "../../../store/auth.slice";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import { useGetCourseQuizzesQuery } from "../../../store/api/quizzes.api";
import { CourseBaseType } from "../../../types/courses";
import EmptyState from "../../../components/EmptyState";
import CBTCodeModal from "./components/CodeModal";

const CourseCBT = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseBaseType | null>(
    null
  );
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0;
  const { data: participantData } =
    useGetParticipantQuery(participantId);
  const { data: quizData, isLoading: isQuizLoading } = useGetCourseQuizzesQuery(
    {
      course_id: selectedCourse?.id || 0,
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitCode = (code: string) => {
    // Handle the submitted code
    console.log("Submitted code:", code);
  };

  return (
    <Box className="content-container">
      <Box
        sx={{
          display: "flex",
          gap: 4,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          p: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 4,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            background: "white",
          }}
        >
          <Typography>Enter CBT code to take test:</Typography>
          <Button sx={{ backgroundColor: "#023678", color:"white", }} onClick={handleOpenModal}>
            Enter CBT Code
          </Button>
          <CBTCodeModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitCode}
          />
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: "320px" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Courses
            </Typography>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {participantData?.data?.courses.map((course: CourseBaseType) => (
                <React.Fragment key={course.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setSelectedCourse(course)}
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
                        secondary={`${course.code}: ${course.name}`}
                        primaryTypographyProps={{
                          fontWeight:
                            selectedCourse?.id === course.id ? 700 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ bgcolor: "#fff" }}>
              {!selectedCourse ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    <EmptyState
                      title="Select a course "
                      subTitle="Select a course to view available CBT tests."
                    />
                  </Typography>
                </Box>
              ) : isQuizLoading ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              ) : !quizData?.data?.length ? (
                <EmptyState
                  title="No quizzes available for this course."
                  subTitle="Wait for an instructor to create a quiz."
                />
              ) : (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {selectedCourse.name} - CBT Tests
                  </Typography>
                  <List>
                    {quizData.data.map((quiz) => (
                      <ListItem
                        key={quiz.id}
                        disablePadding
                        sx={{
                          bgcolor: "#f5f5f5",
                          borderRadius: 1,
                          mb: 2,
                        }}
                      >
                        <Box sx={{ p: 2, width: "100%" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ fontSize: "1.1rem", fontWeight: 500 }}
                            >
                              {quiz.name}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AccessTime fontSize="small" />
                              <Typography variant="body2">
                                {quiz.time_allowed} mins
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <EmojiEvents fontSize="small" />
                              <Typography variant="body2">
                                {quiz.obtainable_score} points
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CalendarToday fontSize="small" />
                              <Typography variant="body2">
                                {format(
                                  new Date(quiz.start_date),
                                  "MMM dd, yyyy"
                                )}{" "}
                                -{" "}
                                {format(
                                  new Date(quiz.expiry_date),
                                  "MMM dd, yyyy"
                                )}
                              </Typography>
                            </Box>
                          </Box>

                          <Button
                            component={Link}
                            to={`/student/cbt-result/${quiz.id}`}
                            variant="contained"
                            fullWidth
                            startIcon={<Assessment />}
                            sx={{
                              bgcolor: "success.main",
                              "&:hover": {
                                bgcolor: "success.dark",
                              },
                            }}
                          >
                            Check Results
                          </Button>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseCBT;
