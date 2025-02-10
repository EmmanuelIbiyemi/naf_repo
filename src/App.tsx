import { Navigate, useLocation } from "react-router-dom";
import "./App.scss";
import { selectCurrentUser, setLastVisitedPage } from "./store/auth.slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { lazy, useEffect, Suspense } from "react";
import { Box, LinearProgress } from "@mui/material";
import { selectBuilderLoading, selectPageLoading } from "./store/app.slice";
import LoadingScreen from "./components/LoadingScreen";
import ErrorBoundary from "./components/ErrorBoundary";

const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const InstructorLayout = lazy(
  () => import("./components/layout/InstructorLayout")
);
const StudentLayout = lazy(() => import("./components/layout/StudentLayout"));

function App() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const isBuilderLoading = useAppSelector(selectBuilderLoading);
  const isPageLoading = useAppSelector(selectPageLoading);
  const location = useLocation();

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
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Box sx={{ fontFamily: "outfit" }}>
          {isPageLoading && (
            <Box
              sx={{
                color: "lightgreen",
                position: "fixed",
                top: 0,
                width: "100%",
                zIndex: 2000,
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
                zIndex: 1999,
              }}
            >
              <LinearProgress color="inherit" sx={{ height: "10px" }} />
            </Box>
          )}

          {renderLayout()}
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
