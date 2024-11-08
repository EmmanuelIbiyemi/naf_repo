import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/auth.slice";
import App from "../App";

const PrivateRoute = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowedRoles
  if (
    allowedRoutes[user.role as keyof typeof allowedRoutes].includes(
      location.pathname
    )
  ) {
    return <App />; // Render the child routes if user is authorized
  }

  // Redirect to an login page if user does not have permission
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;

// Define allowed routes based on user roles
const allowedRoutes = {
  admin: [
    "/", // Dashboard
    "/courses",
    "/instructors",
    "/applications",
    "/form/:form_id",
    "/form/:form_id/preview",
    "/applicants",
    "/cbt",
    "/cbt/:subject_id",
    "/academics", // Includes nested routes for admin academics
    "/academics/:faculty_id",
    "/academics/:faculty_id/:department_id",
    "/academics/:faculty_id/:department_id/:program_id",
    "/academics/:faculty_id/:department_id/:program_id/:level_id",
    "/users", // Includes nested routes for admin users
    "/users/lecturers",
    "/users/students",
    "/users/page/:name",
    "/fees", // Includes nested routes for fees
    "/fees/discount",
    "/fees/page/:name",
    "/grading", // Includes nested routes for grading
    "/grading/scores",
    "/grading/page/:name",
    "/grading/results",
    "/settings", // Includes nested routes for settings
    "/settings/posttype/:resource_type",
    "/settings/posttype/:resource_type/:post_id",
    "/settings/posttype/:resource_type/add",
  ],
  instructor: [
    "/instructor", // Dashboard
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
