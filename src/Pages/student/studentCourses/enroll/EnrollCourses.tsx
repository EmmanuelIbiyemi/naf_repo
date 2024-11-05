import { 
  Box, 
  FormControl, 
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
  Typography,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
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
import { Save } from "@mui/icons-material";
import Breadcrumb from "../components/Breadcrumb";
import { selectCurrentUser } from "../../../../store/auth.slice";
import { CourseBaseType } from "../../../../types/courses";


const EnrollCoursesPage = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const PARTICIPANT_ID = user.id; 

  // API queries and mutations
  const [searchParams, setSearchParams] = useState({ name: "", code: "" });
  const { data: courses, isLoading, error, refetch } = useGetCoursesQuery(searchParams);
  const { data: participantData } = useGetParticipantQuery(PARTICIPANT_ID);
  const [addCourses, { isLoading: isEnrolling }] = useAddCoursesMutation();
  const [dropCourses, { isLoading: isDropping }] = useDropCoursesMutation();

  // State
  const [filteredCourses, setFilteredCourses] = useState<CourseBaseType[]>(courses?.data || []);
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

  // Update filtered courses when search params change
  useEffect(() => {
    if (courses?.data) {
      setFilteredCourses(courses.data);
    }
  }, [courses?.data]);

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

  const handleSearch = () => {
    refetch({ name: searchParams.name, code: searchParams.code });
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
    } catch (error: Error) {
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

      {/* Search Section */}
      <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'white' }}>
        <FormControl sx={{ bgcolor: 'white', borderRadius: 1, flexGrow: 1 }}>
          <TextField
            label="Search by course name or code"
            value={searchParams.name}
            onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </FormControl>
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
                  <TableCell>COURSE NAME</TableCell>
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
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credit_units}</TableCell>
                    <TableCell>{course.semester}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            title="No courses found"
            subTitle="Try adjusting your search criteria"
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