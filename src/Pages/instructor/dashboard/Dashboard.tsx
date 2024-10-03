import { Box } from "@mui/material";
import EmptyState from "../../../components/EmptyState";
import { useRef } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/InstructorPageHeader";

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Dashboard"));

  return (
    <Box ref={containerRef} className="content-container">
      <InstructorPageHeader
        additionalButton={{
          action: () => console.log("Hello"),
          text: "Export Report",
          heading: "Welcome Back, Amina",
          subHeading: "Lorem ipsum dolor sit amet consectetur. Tdbks akd",
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {/* {courses.length ? (
          <CourseList
            courses={courses}
            editCourse={handleOpenEditModal}
            deleteCourse={handleDeleteCourse}
          />
        ) : ( */}
        <EmptyState
          title="Oops looks like there's nothing here"
          subTitle="Information will appear here after an admin has assigned them to you."
        />
        {/* )} */}
      </Box>
    </Box>
  );
};

export default Dashboard;
