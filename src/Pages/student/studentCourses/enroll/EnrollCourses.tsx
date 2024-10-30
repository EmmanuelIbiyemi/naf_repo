import { Box, Select, FormControl, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import EmptyState from "../../../../components/EmptyState";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { useGetCoursesQuery } from "../../../../store/api/courses.api";
import Breadcrumb from "../components/Breadcrumb";
import { Search } from "@mui/icons-material";

const EnrollCoursesPage = () => {
  const { data: courses } = useGetCoursesQuery(null);
  const dispatch = useAppDispatch();

  // Dummy data for dropdowns
  const faculties = ["Science", "Arts", "Engineering"];
  const departments = ["Mathematics", "Physics", "Chemistry"];
  const levels = ["100", "200", "300", "400"];

  // State for filters
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Dummy course data
  const dummyCourses = Array(10).fill({
    code: "MATH 101",
    title: "GEOMETRY",
    creditUnits: "2 CREDIT UNITS",
    semester: "FIRST SEMESTER",
    level: "200 LEVEL"
  });

  useEffect(() => {
    dispatch(setPageName("Enroll Courses"));
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.100',
      }}
      className="content-container"
    >
      <Breadcrumb />

      {/* Filters Section */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          bgcolor: '#D9D9D9',
        }}
      >
        <FormControl sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}>
          <Select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All Faculties</MenuItem>
            {faculties.map((faculty) => (
              <MenuItem key={faculty} value={faculty}>{faculty}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}>
          <Select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All Levels</MenuItem>
            {levels.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Search />}
          sx={{ bgcolor: '#023678', color: 'white' }}
        >
          Search
        </Button>
      </Box>

      {/* Courses Table Section */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {courses?.data.length || dummyCourses.length ? (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>COURSE CODE</TableCell>
                  <TableCell>COURSE TITLE</TableCell>
                  <TableCell>CREDIT UNITS</TableCell>
                  <TableCell>SEMESTER</TableCell>
                  <TableCell>LEVEL</TableCell>
                  <TableCell align="right">ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(courses?.data || dummyCourses).map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.creditUnits}</TableCell>
                    <TableCell>{course.semester}</TableCell>
                    <TableCell>{course.level}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: 'primary.main',
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: 'primary.50'
                          }
                        }}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            title="Oops looks like there's nothing here"
            subTitle="Information will appear here after you enroll courses"
          />
        )}
      </Box>
    </Box>
  );
};

export default EnrollCoursesPage;