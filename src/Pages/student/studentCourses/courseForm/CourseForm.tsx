import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import Breadcrumb from '../components/Breadcrumb';

const CourseRegistrationForm = () => {
  const courseData = [
    {
      code: 'CS101',
      title: 'Introduction to Programming',
      credits: 3,
      instructor: 'Amina Rabi\'u'
    },
    {
      code: 'MATH202',
      title: 'Calculus II',
      credits: 4,
      instructor: 'Amina Rabi\'u'
    },
    {
      code: 'HIST101',
      title: 'World History',
      credits: 3,
      instructor: 'Amina Rabi\'u'
    }
  ];

  const formInfo = [
    {
      field: 'Academic Year',
      information: '2024/2025'
    },
    {
      field: 'Semester',
      information: 'Fall Semester'
    },
    {
      field: 'Prerequisites',
      information: [
        'CS100 is required for CS101',
        'MATH101 is required for MATH202'
      ]
    },
    {
      field: 'Special Note',
      information: 'Ensure all fees are paid before the semester begins'
    }
  ];

  return (
    <>
    <Box>
    <Breadcrumb />
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Student Info Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Amina Rabiu Mustapha
        </Typography>
        <Typography variant="body2" color="text.secondary">
          NAFCONS/01/CSC/2020
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            • 1st Year
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Computer Science
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • 100 Level
          </Typography>
        </Box>
      </Box>

      {/* Course Table */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#002B5B' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>COURSE CODE</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>COURSE TITLE</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>CREDITS</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>INSTRUCTOR NAME</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseData.map((course, index) => (
                <TableRow 
                  key={index}
                  sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}
                >
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Information Section */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#002B5B' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>FIELD</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>INFORMATION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formInfo.map((item, index) => (
                <TableRow 
                  key={index}
                  sx={{ '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' } }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{item.field}</TableCell>
                  <TableCell>
                    {Array.isArray(item.information) ? (
                      item.information.map((info, i) => (
                        <Typography key={i} variant="body2">
                          - {info}
                        </Typography>
                      ))
                    ) : (
                      item.information
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Print Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained"
          sx={{ 
            bgcolor: '#002B5B',
            '&:hover': {
              bgcolor: '#001B3B'
            }
          }}
          onClick={() => window.print()}
        >
          Print this Form
        </Button>
      </Box>
    </Box>
    </Box>
    </>
  );
};

export default CourseRegistrationForm;