import { useNavigate } from "react-router-dom";
import "./App.scss";
import AdminLayout from "./components/layout/AdminLayout";
import InstructorLayout from "./components/layout/InstructorLayout";
import StudentLayout from "./components/layout/StudentLayout";
import {
  selectCurrentUser,
  selectLastVisitedPage,
  setUserFromLocalStorage,
} from "./store/auth.slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle initial auth check and local storage restoration
  useEffect(() => {
    const initializeAuth = async () => {
      if (!user) {
        await dispatch(setUserFromLocalStorage());
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [user, dispatch]);

  // Handle routing after authentication state is confirmed
  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      navigate("/login");
      return;
    }

    // Only handle routing if we have a valid user
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
  }, [user, lastVisitedPage, navigate, isInitialized]);

  // Handle layout rendering based on user role
  const renderLayout = () => {
    if (!user) return null;

    const layouts = {
      admin: AdminLayout,
      instructor: InstructorLayout,
      participant: StudentLayout,
    };

    const Layout = layouts[user.role as keyof typeof layouts];
    return Layout ? <Layout /> : null;
  };

  return (
    <Box sx={{ fontFamily: 'outfit' }}>
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