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
  Paper,
  Button,
  Skeleton,
} from "@mui/material";
import {
  Quiz,
  AccessTime,
  EmojiEvents,
  CalendarToday,
  Assessment,
} from "@mui/icons-material";
import { formatDateShort } from "../../../utils/dateUtils";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectCurrentUser } from "../../../store/auth.slice";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import { useGetCourseQuizzesQuery } from "../../../store/api/quizzes.api";
import { CourseBaseType } from "../../../types/courses";
import EmptyState from "../../../components/EmptyState";
import CBTCodeModal from "./components/CodeModal";

// Add Quiz type definition
interface QuizType {
  id: number;
  name: string;
  time_allowed: number;
  obtainable_score: number;
  start_date: string;
  expiry_date: string;
}

interface QuizItemProps {
  quiz: QuizType;
}

const LoadingQuizSkeleton = () => (
  <ListItem
    disablePadding
    sx={{
      bgcolor: "#f5f5f5",
      borderRadius: 1,
      mb: 2,
    }}
  >
    <Box sx={{ p: 2, width: "100%" }}>
      <Skeleton variant="text" width="60%" height={32} />
      <Box sx={{ display: "flex", gap: 3, my: 2 }}>
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={100} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width="40%" />
      </Box>
      <Skeleton variant="rectangular" height={36} />
    </Box>
  </ListItem>
);

const LoadingCoursesSkeleton = () => (
  <>
    {[1, 2, 3].map((index) => (
      <React.Fragment key={index}>
        <ListItem disablePadding>
          <ListItemButton disabled sx={{ py: 2 }}>
            <ListItemIcon>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary={<Skeleton width="60%" />}
              secondary={<Skeleton width="80%" />}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
      </React.Fragment>
    ))}
  </>
);

const QuizItem: React.FC<QuizItemProps> = ({ quiz }) => (
  <ListItem
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
          <Typography variant="body2">{quiz.time_allowed} mins</Typography>
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
            {formatDateShort(quiz.start_date)} -{" "}
            {formatDateShort(quiz.expiry_date)}
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
);

const CourseCBT = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseBaseType | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0;

  const { data: participantData, isLoading: isParticipantLoading } =
    useGetParticipantQuery(participantId);

  const {
    data: quizData,
    isLoading: isQuizLoading,
    isFetching: isQuizFetching,
  } = useGetCourseQuizzesQuery(
    {
      course_id: selectedCourse?.id || 0,
    },
    {
      skip: !selectedCourse,
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitCode = (code: string) => {
    navigate(`/student/cbt/${code}`);
  };

  const handleCourseSelect = (course: CourseBaseType) => {
    setIsTransitioning(true);
    setSelectedCourse(course);
    // Reset transitioning state after a short delay to ensure smooth animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const isLoadingQuizzes = isQuizLoading || isQuizFetching || isTransitioning;

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
          <Button
            variant="contained"
            sx={{ backgroundColor: "#023678" }}
            onClick={handleOpenModal}
          >
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
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                opacity: isParticipantLoading ? 0.7 : 1,
                transition: "opacity 0.2s ease-in-out",
              }}
            >
              {isParticipantLoading ? (
                <LoadingCoursesSkeleton />
              ) : (
                participantData?.data?.courses?.map((course: CourseBaseType) => (
                  <React.Fragment key={course.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleCourseSelect(course)}
                        disabled={isLoadingQuizzes}
                        sx={{
                          py: 2,
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                          },
                          "&.Mui-disabled": {
                            opacity: 0.7,
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
                ))
              )}
            </List>
          </Box>
          <Box
            sx={{
              flex: 1,
              opacity: isLoadingQuizzes ? 0.7 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <Box sx={{ bgcolor: "#fff" }}>
              {!selectedCourse ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <EmptyState
                    title="Select a course"
                    subTitle="Select a course to view available CBT tests."
                  />
                </Box>
              ) : isLoadingQuizzes ? (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {selectedCourse.name} - CBT Tests
                  </Typography>
                  <List>
                    {[1, 2, 3].map((index) => (
                      <LoadingQuizSkeleton key={index} />
                    ))}
                  </List>
                </Paper>
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
                    {quizData.data.map((quiz: QuizType) => (
                      <QuizItem key={quiz.id} quiz={quiz} />
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
