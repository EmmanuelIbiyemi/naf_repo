import { 
  Box, 
  Select, 
  FormControl, 
  MenuItem, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Checkbox,
  Typography
} from "@mui/material";
import EmptyState from "../../../../components/EmptyState";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { useGetCoursesQuery } from "../../../../store/api/courses.api";
import { selectCurrentUser } from "../../../../store/auth.slice";
import Breadcrumb from "../components/Breadcrumb";
import { Save, Search } from "@mui/icons-material";
import { 
  useGetParticipantQuery,
  useAddCoursesMutation,
  useDropCoursesMutation 
} from "../../../../store/api/participants.api";

const EnrollCoursesPage = () => {
  const dispatch = useAppDispatch();
    const user1 = useAppSelector(selectCurrentUser);
  const participantId = user1.id; // Replace with actual ID source
  const { data: courses, isLoading, error } = useGetCoursesQuery(null);
  const { data: participantData  } = useGetParticipantQuery(participantId);
  const user = participantData.data;
  
  // API mutations
  const [addCourses, { isLoading: isEnrolling }] = useAddCoursesMutation();
  const [dropCourses, { isLoading: isDropping }] = useDropCoursesMutation();

  // State for filters
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState(courses?.data || []);
  
  // State for course selection - store as numbers to match API
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(
    new Set(user?.courses?.map(course => Number(course.id)) || [])
  );

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // Get unique values for filters
  const faculties = [...new Set(courses?.data?.map(course => course.faculty) || [])];
  const departments = [...new Set(courses?.data?.map(course => course.department) || [])];
  const levels = [...new Set(courses?.data?.map(course => course.level) || [])];

  // Initialize page
  useEffect(() => {
    dispatch(setPageName("Enroll Courses"));
  }, [dispatch]);

  // Update filtered courses when filters change
  useEffect(() => {
    if (courses?.data) {
      let filtered = [...courses.data];
      
      if (selectedFaculty !== "all") {
        filtered = filtered.filter(course => course.faculty === selectedFaculty);
      }
      if (selectedDepartment !== "all") {
        filtered = filtered.filter(course => course.department === selectedDepartment);
      }
      if (selectedLevel !== "all") {
        filtered = filtered.filter(course => course.level === selectedLevel);
      }
      
      setFilteredCourses(filtered);
    }
  }, [courses?.data, selectedFaculty, selectedDepartment, selectedLevel]);

  // Initialize selected courses when user data loads
  useEffect(() => {
    if (user?.courses) {
      setSelectedCourses(new Set(user.courses.map(course => Number(course.id))));
    }
  }, [user?.courses]);

  const handleCourseToggle = (courseId: number) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleSaveChanges = async () => {
  try {
    const currentEnrolled = new Set(user?.courses?.map(course => Number(course.id)) || []);
    const selectedCoursesArray = Array.from(selectedCourses);
    
    // Find courses to add and remove
    const coursesToAdd = selectedCoursesArray.filter(id => !currentEnrolled.has(id));
    const coursesToDrop = Array.from(currentEnrolled).filter(id => !selectedCourses.has(id));

    // Perform operations sequentially instead of in parallel
    if (coursesToAdd.length > 0) {
      await addCourses({
        course_ids: coursesToAdd,
      }).unwrap();
    }

    if (coursesToDrop.length > 0) {
      await dropCourses({
        course_ids: coursesToDrop,
      }).unwrap();
    }

    setSnackbar({
      open: true,
      message: "Successfully updated course enrollment",
      severity: "success"
    });
  } catch (error: any) {
    const errorMessage = error.data?.message || error.message || "Failed to update course enrollment";
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error"
    });
    console.error('Error updating courses:', error);
  }
};
  // Rest of your component remains the same...
  if (isLoading) {
    return (
      <Box 
        className="content-container"
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="content-container">
        <Alert severity="error">
          Failed to load courses. Please try again later.
        </Alert>
      </Box>
    );
  }

  const hasChanges = JSON.stringify(Array.from(selectedCourses).sort()) !== 
                     JSON.stringify((user?.courses?.map(c => Number(c.id)) || []).sort());

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.100',
      }}
      className="content-container"
    >
      {/* Previous JSX remains the same... */}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1">
            Selected Courses: {selectedCourses.size}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Save />}
            sx={{ bgcolor: '#023678', color: 'white' }}
            onClick={handleSaveChanges}
            disabled={!hasChanges || isEnrolling || isDropping}
          >
            {isEnrolling || isDropping ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        {filteredCourses.length > 0 ? (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={filteredCourses.length > 0 && 
                              filteredCourses.every(course => selectedCourses.has(Number(course.id)))}
                      indeterminate={filteredCourses.some(course => selectedCourses.has(Number(course.id))) &&
                                   !filteredCourses.every(course => selectedCourses.has(Number(course.id)))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses(new Set([...selectedCourses, ...filteredCourses.map(c => Number(c.id))]));
                        } else {
                          const newSelected = new Set(selectedCourses);
                          filteredCourses.forEach(course => newSelected.delete(Number(course.id)));
                          setSelectedCourses(newSelected);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>COURSE CODE</TableCell>
                  <TableCell>COURSE TITLE</TableCell>
                  <TableCell>CREDIT UNITS</TableCell>
                  <TableCell>SEMESTER</TableCell>
                  <TableCell>LEVEL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow 
                    key={course.id}
                    hover
                    onClick={() => handleCourseToggle(Number(course.id))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCourses.has(Number(course.id))}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCourseToggle(Number(course.id));
                        }}
                      />
                    </TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.creditUnits}</TableCell>
                    <TableCell>{course.semester}</TableCell>
                    <TableCell>{course.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            title="No courses found"
            subTitle="Try adjusting your filters or search criteria"
          />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnrollCoursesPage;