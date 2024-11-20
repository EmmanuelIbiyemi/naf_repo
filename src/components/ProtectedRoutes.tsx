import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrentUser,
  setUserFromLocalStorage,
} from "../store/auth.slice";
import App from "../App";

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
  ],
  instructor: [
    "/instructor",
    "/instructor/settings",
    "/instructor/courses",
    "/instructor/courses/:id",
    "/instructor/courses/:id/details",
    "/instructor/courses/:id/students",
    "/instructor/courses/:id/notes",
    "/instructor/courses/:id/notes/new",
    "/instructor/courses/:id/cbt",
    "/instructor/courses/:id/cbt/:quiz_id",
    "/instructor/courses/:id/cbt/:quiz_id/:assessment_id",
    "/instructor/courses/:id/cbt/:quiz_id/participants",
    "/instructor/courses/:id/cbt/:quiz_id/participants/detail/:user_id/:id",
    "/instructor/courses/:id/cbt/:quiz_id/:assessment_id/manual-input",
    "/instructor/courses/:id/classes",
    "/instructor/courses/:id/tests/manual-input",
    "/instructor/reports",
    "/instructor/reports/:id",
    "/instructor/classes",
    "/instructor/announcements/:id",
    "/instructor/scores",
  ],
  participant: [
    "/student/dashboard",
    "/student/overview",
    "/student/courses",
    "/student/courses/exam-card",
    "/student/courses/course-form",
    "/student/courses/add-course",
    "/student/courses/details",
    "/student/courses/details/notes",
    "/student/courses/details/schedule",
    "/student/reports",
    "/student/live-class",
    "/student/settings",
    "/student/announcements/:id",
  ],
};

const pathMatches = (pathPattern: string, currentPath: string): boolean => {
  // Convert pathPattern with ":params" into a regex
  const regexPattern = new RegExp(`^${pathPattern.replace(/:\w+/g, "\\w+")}$`);
  return regexPattern.test(currentPath);
};

const PrivateRoute = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useAppDispatch();

  if (!user) {
    if (localStorage.getItem("user")) dispatch(setUserFromLocalStorage());
    else return <Navigate to="/login" replace />;
  }

  const userAllowedRoutes =
    allowedRoutes[(user?.role || "admin") as keyof typeof allowedRoutes] || [];

  // Check if the current path matches any allowed route, accounting for parameters
  const isAllowed = userAllowedRoutes.some((allowedRoute) =>
    pathMatches(allowedRoute, location.pathname)
  );

  return isAllowed ? <App /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
