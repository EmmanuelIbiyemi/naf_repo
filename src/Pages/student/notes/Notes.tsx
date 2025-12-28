import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Alert,
  Button,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoogleDocsEditor from '../../../components/layout/GoogleDocsEditor';
import { useGetParticipantCourseNotesQuery } from '../../../store/api/notes.api';
import { note } from '../../../types/notes';
import { formatDateLong } from '../../../utils/dateUtils';


const CourseNotes = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const parsedCourseId = courseId ? parseInt(courseId) : null;

  const { 
    data: response, 
    isLoading, 
    isError,
  } = useGetParticipantCourseNotesQuery(parsedCourseId!, {
    skip: !parsedCourseId
  });

  const handleGoBack = () => {
    navigate('/student/overview'); // Adjust this route as needed
  };

  if (!parsedCourseId) {
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
          <Alert severity="error">
            Invalid Course ID
          </Alert>
        </Box>
      </Box>
    );
  }

  if (isLoading) {
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
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mb: 3 }}
          >
            Back to Courses
          </Button>
          {[1, 2, 3].map((n) => (
            <Paper key={n} sx={{ mb: 4, p: 3 }}>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="85%" />
              <Skeleton variant="text" width="70%" />
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  if (isError) {
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
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mb: 3 }}
          >
            Back to Courses
          </Button>
          <Alert severity="error">
            Error loading notes. Please try again later.
          </Alert>
        </Box>
      </Box>
    );
  }

  if (!response?.data || response?.data?.length === 0) {
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
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mb: 3 }}
          >
            Back to Courses
          </Button>
          <Alert severity="info">
            No notes available for this course yet.
          </Alert>
        </Box>
      </Box>
    );
  }

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
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Back to Courses
        </Button>
        
        {response?.data?.map((note: note) => (
        <Paper 
          key={note.id} 
          sx={{ 
            mb: 4, 
            p: 3,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: (theme) => theme.shadows[4]
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {note.title}
            </Typography>
          </Box>

          <Box sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#fff',
            overflow: 'hidden',
            '& .editor-container': {
              minHeight: '200px',
            },
            '& .editor-input': {
              cursor: 'default',
            }
          }}>
            <GoogleDocsEditor
              initialContent={note?.content}
              readOnly={true}
              placeholder=""
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDateLong(note?.created_at)}
            </Typography>
            {note?.updated_at && (
              <Typography variant="caption" color="text.secondary">
                Last updated: {formatDateLong(note?.updated_at)}
              </Typography>
            )}
          </Box>
        </Paper>
      ))}
      </Box>
    </Box>
  );
};

export default CourseNotes;