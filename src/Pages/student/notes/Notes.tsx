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
import ReactMarkdown from 'react-markdown';
import { useGetParticipantCourseNotesQuery } from '../../../store/api/notes.api';

type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  media: any[];
};

type PaginationInfo = {
  page: number;
  pages: number;
  per_page: number;
  total: number;
};

type ApiResponse = {
  data: Note[];
  message: string;
  pagination: PaginationInfo;
  status: string;
};

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!parsedCourseId) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          Invalid Course ID
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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
    );
  }

  if (isError) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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
    );
  }

  if (!response?.data || response.data.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Back to Courses
      </Button>
      
      {response.data.map((note: Note) => (
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
            '& > .markdown-content': {
              '& strong': {
                fontWeight: 'bold'
              },
              '& em': {
                fontStyle: 'italic'
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                margin: '1em 0 0.5em',
                fontWeight: 'bold',
                lineHeight: 1.2
              },
              '& p': {
                margin: '0.5em 0'
              },
              '& ul, & ol': {
                marginLeft: '1.5em',
                marginBottom: '1em'
              },
              '& code': {
                backgroundColor: (theme) => theme.palette.grey[100],
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '0.9em'
              }
            }
          }}>
            <ReactMarkdown className="markdown-content">
              {note.content}
            </ReactMarkdown>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(note.created_at)}
            </Typography>
            {note.updated_at && (
              <Typography variant="caption" color="text.secondary">
                Last updated: {formatDate(note.updated_at)}
              </Typography>
            )}
          </Box>
        </Paper>
      ))}

      {response.pagination.pages > 1 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Page {response.pagination.page} of {response.pagination.pages}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CourseNotes;