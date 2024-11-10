import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/auth.slice";
import App from "../App";

const allowedRoutes = {
  admin: [
    "/",
    "/courses",
    "/instructors",
    "/applications",
    "/form/:form_id",
    "/form/:form_id/preview",
    "/applicants",
    "/cbt",
    "/cbt/:testId",
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
    "/instructor/courses/:id/tests",
    "/instructor/courses/:id/tests/:testId",
    "/instructor/courses/:id/tests/:testId/detail/:id",
    "/instructor/courses/:id/classes",
    "/instructor/courses/:id/tests/manual-input",
    "/instructor/reports",
    "/instructor/reports/:id",
    "/instructor/classes",
    "/instructor/posts/preview",
    "/instructor/offline-scores",
  ],
  student: [
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userAllowedRoutes =
    allowedRoutes[user.role as keyof typeof allowedRoutes] || [];

  // Check if the current path matches any allowed route, accounting for parameters
  const isAllowed = userAllowedRoutes.some((allowedRoute) =>
    pathMatches(allowedRoute, location.pathname)
  );

  return isAllowed ? <App /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
