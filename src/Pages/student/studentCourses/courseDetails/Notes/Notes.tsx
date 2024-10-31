import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert,
  Button,
  Skeleton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,

} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetCourseNotesQuery, useShareNoteMutation } from '../../../../../store/api/notes.api';
import { selectCurrentUser } from '../../../../../store/auth.slice';
import { note } from '../../../../../types/notes';

const Notes = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const user = useSelector(selectCurrentUser);
  
  const { 
    data: notesData, 
    isLoading, 
    isError, 
    error 
  } = useGetCourseNotesQuery(selectedCourseId, {
    skip: !selectedCourseId
  });
  
  const [shareNote, { isLoading: isSharing }] = useShareNoteMutation();

  const handleShare = async (noteId: number) => {
    if (!selectedCourseId) return;
    setSelectedNote(noteId);
    try {
      await shareNote({ 
        noteId,
        courseId: selectedCourseId
      }).unwrap();
      // You could add a success notification here
    } catch (error) {
      console.error('Error sharing note:', error);
      // You could add an error notification here
    } finally {
      setSelectedNote(null);
    }
  };

  if (!user?.courses?.data?.length) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="info">
          You are not enrolled in any courses yet.
        </Alert>
      </Box>
    );
  }

  // Show course list if no course is selected
  if (!selectedCourseId) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Your Courses
        </Typography>
        <Paper>
          <List>
            {user.courses.data.map((course, index) => (
              <>
                <ListItem disablePadding key={course.id}>
                  <ListItemButton onClick={() => setSelectedCourseId(course.id)}>
                    <ListItemText 
                      primary={course.title}
                      secondary={course.description || 'No description available'}
                    />
                  </ListItemButton>
                </ListItem>
                {index < user.courses.data.length - 1 && <Divider />}
              </>
            ))}
          </List>
        </Paper>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => setSelectedCourseId(null)}
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
          onClick={() => setSelectedCourseId(null)}
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

  if (!notesData?.data || notesData.data.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => setSelectedCourseId(null)}
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={() => setSelectedCourseId(null)}
        sx={{ mb: 3 }}
      >
        Back to Courses
      </Button>
      {notesData.data.map((note: note) => (
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
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleShare(note.id)}
              disabled={isSharing && selectedNote === note.id}
            >
              {isSharing && selectedNote === note.id ? (
                <CircularProgress size={20} />
              ) : (
                'Share'
              )}
            </Button>
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              whiteSpace: 'pre-wrap'  // Preserves formatting
            }}
          >
            {note.content}
          </Typography>

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
    </Box>
  );
};

export default Notes;