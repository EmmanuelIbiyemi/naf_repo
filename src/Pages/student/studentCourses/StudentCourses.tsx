import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import EnrolledCoursesHeader from "./CoursesHeader";
import { Link } from 'react-router-dom';

const EnrolledCoursesPage = () => {
  // Dummy data for enrolled courses
  const enrolledCourses = [
    {
      id: "1",
      title: "Articulate structure of C++ and Java in Semester 1",
      course: "B.Tech Specialization in Health Informatics",
      unitLevel: 4,
      schedule: "Mon - Thur",
      time: "12:30 AM - 01:40 PM",
      instructor: "Mrs Amina Rabiu Mustapha",
    },
    {
      id: "2",
      title: "Introduction to Algorithms",
      course: "B.Tech in Computer Science",
      unitLevel: 3,
      schedule: "Tue & Fri",
      time: "10:00 AM - 12:00 PM",
      instructor: "Dr. Aliyu Ibrahim",
    },
    {
      id: "3",
      title: "Advanced Health Informatics",
      course: "B.Tech Specialization in Health Informatics",
      unitLevel: 5,
      schedule: "Wed & Sat",
      time: "08:00 AM - 10:00 AM",
      instructor: "Prof. John Doe",
    },
    // Add more dummy data as needed
  ];

  // Set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Enrolled Courses"));
  }, [dispatch]);

  return (
    <Box className="content-container">

      <EnrolledCoursesHeader />
      
      <Box
        sx={{
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
              lg: '1fr 1fr 1fr'
            },
            gap: 3
          }}
        >
          {enrolledCourses.map((course, index) => (
            <Box
              key={course.id}
              sx={{
                display:"flex",
                flexDirection:"column",
                bgcolor: "#fff",
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ 
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    mb: 1
                  }}>
                    {course.title}
                  </Box>
                </Box>
                {index === 0 && (
                  <Box sx={{ 
                    color: 'error.main',
                    fontSize: '1.5rem'
                  }}>
                    •
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  mb: 1
                }}>
                  Course: {course.course}
                </Box>
                <Box sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}>
                  Unit Level: {course.unitLevel}
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex',
                gap: 2,
                mb: 2,
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>📅</span>
                  <span>{course.schedule}</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🕒</span>
                  <span>{course.time}</span>
                </Box>
              </Box>

              <Box sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                mb: 2
              }}>
                Instructor: {course.instructor}
              </Box>
              <Box sx={{ 
                mt:"auto",
              }}>


<Link to="/student/courses/details/notes" >
  <Button variant="contained" sx={{ width: "100%" }}>
          View Details
        </Button>
</Link>


              </Box>
              
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EnrolledCoursesPage;
