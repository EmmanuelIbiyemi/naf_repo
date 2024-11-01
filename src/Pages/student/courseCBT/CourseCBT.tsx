import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
  CircularProgress,
  Modal,
  IconButton,
  Button
} from "@mui/material";
import {
  Quiz,
  ArrowForward,
  Close,
  AccessTime,
  EmojiEvents,
  CalendarToday
} from "@mui/icons-material";
import { format } from 'date-fns';
import EmptyState from "../../../components/EmptyState";
import { useAppSelector } from '../../../store/hooks';
import { selectCurrentUser } from '../../../store/auth.slice';
import { useGetParticipantQuery } from '../../../store/api/participants.api';
import { useGetCourseQuizzesQuery } from '../../../store/api/quizzes.api';
import { Link } from 'react-router-dom'
const QuizModal = ({ open, onClose, courseId, courseTitle }) => {
  const { data: quizData, isLoading } = useGetCourseQuizzesQuery(courseId);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflow: 'auto'
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="quiz-modal-title"
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Available Quizzes - {courseTitle}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : !quizData?.data?.length ? (
          <EmptyState
            title="No quizzes available"
            subTitle="There are currently no quizzes available for this course."
          />
        ) : (
          <List>
            {quizData.data.map((quiz, index) => (
              <React.Fragment key={quiz.id}>
                <ListItem 
                  disablePadding 
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    mb: index < quizData.data.length - 1 ? 2 : 0
                  }}
                >
                  <Box sx={{ p: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        {quiz.name}
                      </Typography>
                      <Chip 
                        label={quiz.type} 
                        size="small"
                        color={quiz.type === 'graded' ? 'primary' : 'default'}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2">{quiz.time_allowed} mins</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEvents fontSize="small" />
                        <Typography variant="body2">{quiz.obtainable_score} points</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" />
                        <Typography variant="body2">
                          {format(new Date(quiz.start_date), 'MMM dd, yyyy')} - {format(new Date(quiz.expiry_date), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      component={Link}
                      to={`/student/cbt/${quiz.id}`} // Link destination
                      variant="contained"
                      fullWidth
                      disabled={!quiz.is_published}
                    >
                      {quiz.is_published ? 'Start Quiz' : 'Not Yet Available'}
                    </Button>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

const CourseCBTList = ({ courses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (!courses?.length) {
    return (
      <EmptyState
        title="No courses registered"
        subTitle="Register for courses to access CBT tests from instructors."
      />
    );
  }

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {courses.map((course, index) => (
          <React.Fragment key={course.id}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => setSelectedCourse(course)}
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <ListItemIcon>
                  <Quiz color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={course.title}
                  secondary={`${course.code}: ${course.name}`}
                  primaryTypographyProps={{
                    fontWeight: 500
                  }}
                />
                {course.activeCBTs > 0 && (
                  <Chip 
                    label={`${course.activeCBTs} Active`}
                    color="primary"
                    size="small"
                    sx={{ mr: 2 }}
                  />
                )}
                <ArrowForward sx={{ color: 'text.secondary' }} />
              </ListItemButton>
            </ListItem>
            {index < courses.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>

      <QuizModal 
        open={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.title}
      />
    </>
  );
};

const CourseCBT = () => {
  const user = useAppSelector(selectCurrentUser);
  const participantId = user.id;
  const { data: participantData, isLoading, error } = useGetParticipantQuery(participantId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !participantData) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <EmptyState
          title="Error loading data"
          subTitle="There was a problem loading your CBT information. Please try again later."
        />
      </Box>
    );
  }

  const { data: participant } = participantData;

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h2" sx={sectionTitleStyle}>
        Course CBT Tests
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Access computer-based tests and assessments for your registered courses
      </Typography>

      <Card sx={{ bgcolor: "#fff", borderRadius: "var(--border-radius)" }}>
        <CardContent>
          <CourseCBTList courses={participant.courses} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CourseCBT;

// Styles remain the same as Overview component
const sectionTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: 500,
  marginBottom: "1.5rem",
};