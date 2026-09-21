import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useEffect } from "react";
import { useGetInstructorCoursesQuery } from "../../store/api/courses.api";
import { useAppDispatch } from "../../store/hooks";
import { setPageLoading } from "../../store/app.slice";
import EmptyState from "../EmptyState";

interface InstructorCourseSelectorProps {
  selectedCourseId: string;
  onCourseChange: (courseId: string) => void;
  label?: string;
  showEmptyState?: boolean;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const InstructorCourseSelector: React.FC<InstructorCourseSelectorProps> = ({
  selectedCourseId,
  onCourseChange,
  label = "Select Course",
  showEmptyState = true,
  emptyStateTitle = "Please select a course",
  emptyStateSubtitle = "Choose a course from the dropdown to view its content",
  disabled = false,
  children,
}) => {
  const dispatch = useAppDispatch();

  const { data: instructorCourses, isLoading: isLoadingCourses } = useGetInstructorCoursesQuery({
    page: 1,
    per_page: 1000,
  });

  useEffect(() => {
    if (isLoadingCourses) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isLoadingCourses, dispatch]);

  const handleCourseChange = (event: SelectChangeEvent<string>) => {
    const courseId = event.target.value as string;
    onCourseChange(courseId);
    // Persist the selection
    if (courseId) {
      localStorage.setItem("lastSelectedCourseId", courseId);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "var(--border-radius)",
        marginInline: "var(--padding)",
        padding: "var(--padding)",
        margin: "1em",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ marginBottom: selectedCourseId && children ? 3 : 0 }}>
        <FormControl fullWidth>
          <InputLabel id="instructor-course-select-label">{label}</InputLabel>
          <Select
            labelId="instructor-course-select-label"
            id="instructor-course-select"
            value={selectedCourseId}
            label={label}
            onChange={handleCourseChange}
            disabled={disabled || isLoadingCourses}
          >
            {instructorCourses?.data.map((course) => (
              <MenuItem key={course.id} value={course.id?.toString() || ""}>
                {course.name} ({course.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedCourseId ? (
        children
      ) : (
        showEmptyState && (
          <EmptyState title={emptyStateTitle} subTitle={emptyStateSubtitle} />
        )
      )}
    </Box>
  );
};

export default InstructorCourseSelector;
