import { useLocation, useNavigate } from "react-router-dom";
import "./App.scss";
import AdminLayout from "./components/layout/AdminLayout";
import InstructorLayout from "./components/layout/InstructorLayout";
import StudentLayout from "./components/layout/StudentLayout";
import {
  selectCurrentUser,
  selectLastVisitedPage,
  setLastVisitedPage,
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
  const location = useLocation();

  // Handle routing based on user role
  useEffect(() => {
    if (user) {
      if (lastVisitedPage) {
        navigate(lastVisitedPage);
      } else {
        // Default routes based on user role
        const roleRoutes = {
          participant: "/student/dashboard",
          admin: "/",
          instructor: "/instructor/",
        };

        const defaultRoute = roleRoutes[user.role as keyof typeof roleRoutes];
        if (defaultRoute) {
          navigate(defaultRoute);
        } else {
          // Invalid role, log out user
          console.error("Invalid user role detected:", user.role);
          navigate("/login");
        }
      }
    }
  }, [user, lastVisitedPage, navigate]);

  // Update last visited page
  useEffect(() => {
    dispatch(setLastVisitedPage(location.pathname));
  }, [location, dispatch]);

  // Handle layout rendering based on user role
  const renderLayout = () => {
    switch (user?.role) {
      case "admin":
        return <AdminLayout />;
      case "instructor":
        return <InstructorLayout />;
      case "participant":
        return <StudentLayout />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ fontFamily: "outfit" }}>
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
