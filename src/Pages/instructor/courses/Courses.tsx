import { Box, Grid2, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName, setPageLoading } from "../../../store/app.slice";
import CoursesCard from "./CoursesCard";
import { useGetInstructorCoursesQuery } from "../../../store/api/courses.api";
import CustomPagination from "../../../components/CustomPagination";

const Courses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: courses, isLoading } = useGetInstructorCoursesQuery({
    page: currentPage,
    per_page: 9,
  });

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Courses"));
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isLoading, dispatch]);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const totalItems = courses?.pagination?.total || 0;
  // const totalPages = scheduledClasses?.pagination?.pages || 1;
  const itemsPerPage = courses?.pagination.per_page || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <Box ref={containerRef} className="content-container">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          padding: "var(--padding)",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="h3" sx={{ fontSize: "2em", color: "#000000" }}>
            Assigned Courses
          </Typography>
          <Box sx={{ marginTop: "3em" }}>
            <Grid2 container spacing={2}>
              {courses?.data.map((course) => (
                <Grid2 size={4} key={course.id}>
                  <CoursesCard course={course} />
                </Grid2>
              ))}
            </Grid2>
            <CustomPagination
              startIndex={startIndex + 1}
              endIndex={endIndex}
              totalNumber={totalItems}
              count={Math.ceil(totalItems / itemsPerPage)}
              page={currentPage}
              handleChangePage={handleChangePage}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Courses;
