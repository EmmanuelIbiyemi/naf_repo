import { Navigate, useLocation, useNavigation } from "react-router-dom";
import "./App.scss";
import { selectCurrentUser, setLastVisitedPage } from "./store/auth.slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { lazy, useEffect, Suspense, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import {
  selectBuilderLoading,
  selectPageLoading,
  setPageLoading,
} from "./store/app.slice";
import LoadingScreen from "./components/LoadingScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineOverlay from "./components/OfflineOverlay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const navigation = useNavigation();
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator === "undefined") return false;
    return !navigator.onLine;
  });

  const isRouteLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  // Update last visited page
  useEffect(() => {
    dispatch(setLastVisitedPage(location.pathname));
  }, [location, dispatch]);

  useEffect(() => {
    const updateConnectionStatus = () => {
      if (typeof navigator === "undefined") return;
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
    };
  }, []);

  const retryOfflineCheck = () => {
    if (typeof navigator === "undefined") return;
    setIsOffline(!navigator.onLine);
  };

  useEffect(() => {
    if (!isPageLoading) return;

    const timeout = setTimeout(() => {
      dispatch(setPageLoading(false));
      toast.error(
        "Loading is taking longer than expected. Please check your connection or try again."
      );
    }, 15000);

    return () => clearTimeout(timeout);
  }, [dispatch, isPageLoading]);

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
      <Suspense fallback={<LoadingScreen />}>
        <Box sx={{ fontFamily: "outfit", position: "relative", minHeight: "100vh" }}>
          {isRouteLoading && <LoadingScreen />}

          {isPageLoading && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1900,
                pointerEvents: "none",
              }}
            >
              <LinearProgress color="primary" sx={{ height: "5px" }} />
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

          <Box
            sx={{
              filter: isOffline ? "blur(2px)" : "none",
              pointerEvents: isOffline ? "none" : "auto",
              transition: "filter 0.2s ease",
              minHeight: "100vh",
            }}
          >
            {renderLayout()}
          </Box>
          <ToastContainer />
          <OfflineOverlay open={isOffline} onRetry={retryOfflineCheck} />
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
