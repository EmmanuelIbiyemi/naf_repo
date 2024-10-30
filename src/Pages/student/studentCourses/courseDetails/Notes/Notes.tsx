import { Box, Paper, Typography } from '@mui/material';

const Notes = () => {
  const notes = [
    {
      title: 'Upcoming Assignments',
      content: [
        'Complete project proposal by next Friday',
        'Review research paper guidelines for midterm paper',
        'Schedule meeting with instructor to discuss final project'
      ]
    },
    {
      title: 'Key Concepts Covered',
      content: [
        'Object-oriented programming principles',
        'Data structures and algorithms',
        'Fundamentals of database management'
      ]
    },
    {
      title: 'Recommended Resources',
      content: [
        'Textbook: "Introduction to Computer Science" by John Doe',
        'Online tutorial: "Building Web Applications with React"',
        'Journal article: "Advances in Artificial Intelligence"'
      ]
    }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {notes.map((note, index) => (
        <Paper key={index} sx={{ mb: 4, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            {note.title}
          </Typography>
          {note.content.map((item, i) => (
            <Typography key={i} variant="body2" sx={{ mb: 1 }}>
              - {item}
            </Typography>
          ))}
        </Paper>
      ))}
    </Box>
  );
};

export default Notes;