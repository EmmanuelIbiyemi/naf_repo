import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrentUser,
  setUserFromLocalStorage,
} from "../store/auth.slice";
import App from "../App";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const allowedRoutes = {
  admin: [
    "/",
    "/sessions",
    "/sessions/:session_id",
    "/applications",
    "/eligibles",
    "/form/:form_id",
    "/form/:form_id/preview",
    "/applicants",
    "/applicants/:program_id",
    "/cbt",
    "/cbt/:quiz_id",
    "/cbt/:quiz_id/:assessment_id",
    "/cbt/:testId/detail/:user_id/:id",
    "/cbt/manual-input",
    "/academics",
    "/academics/:faculty_id",
    "/academics/:faculty_id/:department_id",
    "/academics/:faculty_id/:department_id/:program_id",
    "/academics/:faculty_id/:department_id/:program_id/:level_id",
    "/users",
    "/users/lecturers",
    "/users/students",
    "/users/page/:name",
    "/fees",
    "/fees/discount",
    "/fees/page/:name",
    "/grading",
    "/grading/scores",
    "/grading/page/:name",
    "/grading/results",
    "/settings",
    "/settings/profile",
    "/settings/posttype/:resource_type",
    "/settings/posttype/:resource_type/:post_id",
    "/settings/posttype/:resource_type/add",
    "/activity-logs",
  ],
  instructor: [
    "/instructor",
    "/instructor/settings",
    "/instructor/courses",
    "/instructor/courses/:id",
    "/instructor/courses/:id/details",
    "/instructor/courses/:id/students",
    // "/instructor/courses/:id/notes",
    // "/instructor/courses/:id/notes/new",
    // "/instructor/courses/:id/cbt",
    // "/instructor/courses/:id/cbt/:quiz_id",
    // "/instructor/courses/:id/cbt/:quiz_id/:assessment_id",
    // "/instructor/courses/:id/cbt/:quiz_id/participants",
    // "/instructor/courses/:id/cbt/:quiz_id/participants/detail/:user_id/:id",
    // "/instructor/courses/:id/cbt/:quiz_id/:assessment_id/manual-input",
    "/instructor/notes",
    "/instructor/notes/:courseId/new",
    "/instructor/notes/:courseId/:noteId/edit",
    "/instructor/cbt",
    "/instructor/cbt/:courseId/:quiz_id",
    "/instructor/cbt/:courseId/:quiz_id/:assessment_id",
    "/instructor/cbt/:courseId/:quiz_id/participants",
    "/instructor/cbt/:courseId/:quiz_id/participants/detail/:user_id/:id",
    "/instructor/cbt/:courseId/:quiz_id/:assessment_id/manual-input",
    "/instructor/classes",
    "/instructor/tests/manual-input",
    "/instructor/reports",
    "/instructor/reports/:id",
    "/instructor/classes",
    "/instructor/announcements/:id",
    "/instructor/scores",
    "/instructor/my-activity",
  ],
  participant: [
    "/student/dashboard",
    "/student/overview",
    "/student/courses",
    "/student/courses/exam-card",
    "/student/courses/course-card",
    "/student/courses/course-form",
    "/student/courses/add-course",
    "/student/courses/details",
    "/student/courses/:courseId/notes",
    "/student/courses/details/schedule",
    "/student/cbt",
    "/student/cbt/:quizCode",
    "/student/cbt-result/:quizId",
    "/student/results",
    "/student/live-class",
    "/student/settings",
    "/student/announcements/:id",
    "/student/my-activity",
  ],
};

const pathMatches = (pathPattern: string, currentPath: string): boolean => {
  // Convert pathPattern with ":params" into a regex that matches word chars and hyphens
  const regexPattern = new RegExp(`^${pathPattern.replace(/:\w+/g, "[\\w\\-]+")}$`);
  return regexPattern.test(currentPath);
};

const PrivateRoute: React.FC = () => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUser = async () => {
      if (!user && localStorage.getItem("user")) {
        dispatch(setUserFromLocalStorage());
      }
      setIsUserLoaded(true);
    };

    loadUser();
  }, [dispatch, user]);

  // If user loading is not complete, show a loading state or null
  if (!isUserLoaded) {
    return <LoadingScreen />;
  }

  const userAllowedRoutes =
    allowedRoutes[(user?.role || "") as keyof typeof allowedRoutes] || [];

  // Check if the current path matches any allowed route, accounting for parameters
  const isAllowed = userAllowedRoutes.some((allowedRoute) =>
    pathMatches(allowedRoute, location.pathname)
  );

  return isAllowed ? <App /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;