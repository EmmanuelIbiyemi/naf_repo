import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGetParticipantQuery } from '../../../store/api/participants.api';
import { useAppSelector } from '../../../store/hooks';
import { selectCurrentUser } from '../../../store/auth.slice';
import CoursesHeader from './CoursesHeader';
import { CourseBaseType } from '../../../types/courses';
import { InstructorType } from '../../../types/instructors';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)({
  fontSize: '1rem',
});



const StudentCourses: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0; // Replace with actual ID source

  const { data: response, isLoading, error } = useGetParticipantQuery(participantId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !response?.data) {
    return (
      <Box p={2}>
        <Typography color="error">
          Error loading participant data
        </Typography>
      </Box>
    );
  }

  const { data: participant } = response;

  return (
    <Box p={3}>
      <CoursesHeader />

      {/* Personal Information Card */}
      <StyledCard>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <InfoLabel>Matric Number</InfoLabel>
              <InfoValue>
                {participant.matric_number || "Not assigned"}
              </InfoValue>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoLabel>Level</InfoLabel>
              <InfoValue>{participant.level?.name || "Not assigned"}</InfoValue>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Courses Card */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            Enrolled Courses
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Credit Units</TableCell>
                  <TableCell>Instructor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participant.courses?.map((course: CourseBaseType) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={course.semester}
                        color={
                          course.semester === "First Semester"
                            ? "primary"
                            : "secondary"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{course.credit_units || "N/A"}</TableCell>
                    <TableCell>
                      {course.instructors?.map((instructor: InstructorType) => (
                        <Typography key={instructor.id} variant="body2">
                          {instructor.first_name} {instructor.last_name}
                        </Typography>
                      )) || "No instructor assigned"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default StudentCourses;