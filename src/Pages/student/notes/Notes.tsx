import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Alert,
  Button,
  Skeleton,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import GoogleDocsEditor from '../../../components/layout/GoogleDocsEditor';
import { useGetParticipantCourseNotesQuery } from '../../../store/api/notes.api';
import { note } from '../../../types/notes';
import { formatDateLong } from '../../../utils/dateUtils';
import { useState } from 'react';


const CourseNotes = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const parsedCourseId = courseId ? parseInt(courseId) : null;
  const [selectedNote, setSelectedNote] = useState<note | null>(null);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

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

  const handleNoteClick = (note: note) => {
    setSelectedNote(note);
    setOpenPreviewModal(true);
  };

  const handleClosePreview = () => {
    setOpenPreviewModal(false);
    setSelectedNote(null);
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
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Course Notes
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {response?.data?.map((note: note) => (
            <Card 
              key={note.id} 
              sx={{ 
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8]
                }
              }}
            >
              <CardActionArea onClick={() => handleNoteClick(note)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 500, flexGrow: 1 }}>
                      {note.title}
                    </Typography>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {note.content ? note.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'Click to view content'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Created: {formatDateLong(note?.created_at)}
                    </Typography>
                    {note?.updated_at && (
                      <Typography variant="caption" color="text.secondary">
                        Updated: {formatDateLong(note?.updated_at)}
                      </Typography>
                    )}
                  </Box>

                  <Chip 
                    label="Click to view" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {/* Preview Modal */}
        <Dialog
          open={openPreviewModal}
          onClose={handleClosePreview}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedNote?.title}
            </Typography>
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedNote && (
              <>
                <Box sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  overflow: 'hidden',
                  mb: 2,
                  '& .editor-container': {
                    minHeight: '300px',
                  },
                  '& .editor-input': {
                    cursor: 'default',
                  }
                }}>
                  <GoogleDocsEditor
                    initialContent={selectedNote?.content}
                    readOnly={true}
                    placeholder=""
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDateLong(selectedNote?.created_at)}
                  </Typography>
                  {selectedNote?.updated_at && (
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {formatDateLong(selectedNote?.updated_at)}
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePreview} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
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