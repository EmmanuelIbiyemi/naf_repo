import { useNavigate } from "react-router-dom";
import "./App.scss";
import AdminLayout from "./components/layout/AdminLayout";
import InstructorLayout from "./components/layout/InstructorLayout";
import StudentLayout from "./components/layout/StudentLayout";  // Add this import
import {
  selectCurrentUser,
  selectLastVisitedPage,
  setUserFromLocalStorage,
} from "./store/auth.slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import { Box, LinearProgress } from "@mui/material";
import { selectBuilderLoading, selectPageLoading } from "./store/app.slice";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lastVisitedPage = useAppSelector(selectLastVisitedPage);
  const isBuilderLoading = useAppSelector(selectBuilderLoading);
  const isPageLoading = useAppSelector(selectPageLoading);

  useEffect(() => {
    if (!user) {
      dispatch(setUserFromLocalStorage());
      if (!user) navigate("/login");
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (user && lastVisitedPage) {
      navigate(lastVisitedPage);
    } else if (user) {
      // Default routes based on user role
      switch (user.role) {
        case "admin":
          navigate("/");
          break;
        case "instructor":
          navigate("/instructor");
          break;
        case "student":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/login");
      }
    }
  }, [user, lastVisitedPage, navigate]);

  const renderLayout = () => {
    switch (user?.role) {
      case "admin":
        return <AdminLayout />;
      case "instructor":
        return <InstructorLayout />;
      case "student":
        return <StudentLayout />;
      default:
        return null;
    }
  };

  return (
    <Box
    sx={{
          fontFamily:'outfit',
          }}>
      {isPageLoading && (
        <Box
          sx={{
            color: "lightgreen",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 101,
          }}
        >
          <LoadingScreen />
        </Box>
      )}

      {isBuilderLoading && (
        <Box
          sx={{
            color: "lightgreen",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 100,
          }}
        >
          <LinearProgress color="inherit" sx={{ height: "10px" }} />
        </Box>
      )}
      
      {renderLayout()}
    </Box>
  );
}

export default App;