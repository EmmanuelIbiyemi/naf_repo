import { Box, Typography, Button } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import { AddCircleOutline } from "@mui/icons-material";
import { Link } from "react-router-dom"; // or "next/link" if using Next.js

const CoursesHeader = () => {
  return (
    <Box
      sx={{
        borderColor: 'divider',
        px: 3,
        py: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      {/* Title and Subtitle Section */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'outfit',
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.5
          }}
        >
          Enrolled Courses
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'outfit',
            color: 'text.secondary',
            fontSize: '11px'
          }}
        >
          Below is a list of all the courses you have been enrolled to
        </Typography>
      </Box>

      {/* Buttons Section */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexShrink: 0,
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        <Button
          component={Link}
          to="exam-card" // Link destination
          variant="outlined"
          startIcon={<SchoolIcon />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            flex: { xs: 1, sm: 'none' },
            whiteSpace: 'nowrap'
          }}
        >
          Exam Card
        </Button>
        
        {/* <Button
          component={Link}
          to="course-form" // Link destination
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            flex: { xs: 1, sm: 'none' },
            whiteSpace: 'nowrap'
          }}
        >
          Course Form
        </Button> */}
        
        <Button
          component={Link}
          to="add-course" // Link destination
          variant="contained"
          startIcon={<AddCircleOutline />}
          sx={{
            bgcolor: '#002B5B',
            '&:hover': {
              bgcolor: '#001B3B'
            },
            borderRadius: 1,
            textTransform: 'none',
            flex: { xs: 1, sm: 'none' },
            whiteSpace: 'nowrap'
          }}
        >
          Add Course
        </Button>
      </Box>
    </Box>
  );
};

export default CoursesHeader;
