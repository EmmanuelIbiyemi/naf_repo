import { Box, Card, CardContent, Typography } from '@mui/material';

const CourseDetailsCard = () => {
  const courseData = {
    title: "Articulate structure of C++ and Java in Semester 1",
    course: "B.Tech Specialization in Health Informatics",
    instructor: "Mrs Amina Rabia Mustapha",
    unitLevel: 4,
    schedule: "Mon - Thur",
    time: "12:30 AM - 01:40 PM",
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {courseData.title}
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Course: {courseData.course}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unit Level: {courseData.unitLevel}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Schedule: {courseData.schedule}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Time: {courseData.time}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Instructor: {courseData.instructor}
        </Typography>
        <Box mt={2}>
          <Typography  color="primary" component="a" href="courses/details/notes" sx={{ textDecoration: 'none' }}>
            View Details
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

  export default CourseDetailsCard;