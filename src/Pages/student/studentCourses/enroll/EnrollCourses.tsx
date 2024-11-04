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
import { 
  useGetParticipantQuery,
  useAddCoursesMutation,
  useDropCoursesMutation 
} from "../../../../store/api/participants.api";
import { Save, Search } from "@mui/icons-material";
import Breadcrumb from "../components/Breadcrumb";
import { selectCurrentUser } from "../../../../store/auth.slice";



const EnrollCoursesPage = () => {
  const dispatch = useAppDispatch();

    const user = useAppSelector(selectCurrentUser);
    const PARTICIPANT_ID = user.id; 
  
  // API queries and mutations
  const { data: courses, isLoading, error } = useGetCoursesQuery(null);
  const { data: participantData } = useGetParticipantQuery(PARTICIPANT_ID);
  const [addCourses, { isLoading: isEnrolling }] = useAddCoursesMutation();
  const [dropCourses, { isLoading: isDropping }] = useDropCoursesMutation();

  // State
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState(courses?.data || []);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // Initialize page
  useEffect(() => {
    dispatch(setPageName("Enroll Courses"));
  }, [dispatch]);

  // Update filtered courses when semester changes
  useEffect(() => {
    if (courses?.data) {
      let filtered = [...courses.data];
      
      if (selectedSemester !== "all") {
        filtered = filtered.filter(course => course.semester === selectedSemester);
      }
      
      setFilteredCourses(filtered);
    }
  }, [courses?.data, selectedSemester]);

  // Initialize selected courses when user data loads
  useEffect(() => {
    if (participantData?.data?.courses) {
      setSelectedCourses(new Set(participantData.data.courses.map(course => Number(course.id))));
    }
  }, [participantData?.data?.courses]);

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
      const currentEnrolled = new Set(participantData?.data?.courses?.map(course => Number(course.id)) || []);
      const selectedCoursesArray = Array.from(selectedCourses);
      
      const coursesToAdd = selectedCoursesArray.filter(id => !currentEnrolled.has(id));
      const coursesToDrop = Array.from(currentEnrolled).filter(id => !selectedCourses.has(id));

      if (coursesToAdd.length > 0) {
        await addCourses({ course_ids: coursesToAdd }).unwrap();
      }

      if (coursesToDrop.length > 0) {
        await dropCourses({ course_ids: coursesToDrop }).unwrap();
      }

      setSnackbar({
        open: true,
        message: "Successfully updated course enrollment",
        severity: "success"
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.data?.message || "Failed to update course enrollment",
        severity: "error"
      });
      console.error('Error updating courses:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="content-container">
        <Alert severity="error">Failed to load courses. Please try again later.</Alert>
      </Box>
    );
  }

  const hasChanges = JSON.stringify(Array.from(selectedCourses).sort()) !== 
                     JSON.stringify((participantData?.data?.courses?.map(c => Number(c.id)) || []).sort());

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }} className="content-container">
      <Breadcrumb />

      {/* Semester Selector */}
      <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#D9D9D9' }}>
        <FormControl sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 200 }}>
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All Semesters</MenuItem>
            <MenuItem value="First">First Semester</MenuItem>
            <MenuItem value="Second">Second Semester</MenuItem>
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
      <Box sx={{ bgcolor: "#fff", borderRadius: "var(--border-radius)", m: 2, p: 2 }}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            title="No courses found"
            subTitle="Try adjusting your semester filter"
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