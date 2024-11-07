import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,

  Chip,
  CircularProgress,
  Modal,
  IconButton,
  Button
} from "@mui/material";
import {
  Close,
  AccessTime,
  EmojiEvents,
  CalendarToday,
  Assessment
} from "@mui/icons-material";
import { format } from 'date-fns';
import EmptyState from "../../../../components/EmptyState";
import { useGetCourseQuizzesQuery } from '../../../../store/api/quizzes.api';
import { Link } from 'react-router-dom';

type Props = {
  open: string;
  onClose:string;
  courseId: number;
  courseTitle: string;
}

const QuizModal = ({ open, onClose, courseId, courseTitle }) => {
  const { data: quizData, isLoading } = useGetCourseQuizzesQuery({course_id: courseId});

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

  const isQuizExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
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

                    {isQuizExpired(quiz.expiry_date) ? (
                      <Button
                        component={Link}
                        to={`/student/cbt-result/${quiz.id}`}
                        variant="contained"
                        fullWidth
                        startIcon={<Assessment />}
                        sx={{
                          bgcolor: 'success.main',
                          '&:hover': {
                            bgcolor: 'success.dark',
                          }
                        }}
                      >
                        Check Results
                      </Button>
                    ) : (
                      <Button
                        component={Link}
                        to={`/student/cbt/${quiz.id}`}
                        variant="contained"
                        fullWidth
                        disabled={!quiz.is_published}
                      >
                        {quiz.is_published ? 'Start Quiz' : 'Not Yet Available'}
                      </Button>
                    )}
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

export default QuizModal;