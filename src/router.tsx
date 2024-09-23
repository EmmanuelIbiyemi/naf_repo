import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const App = lazy(() => import("./App"));
const Login = lazy(() => import("./Pages/login/Login"));
const Dashboard = lazy(() => import("./Pages/dashboard/Dashboard"));
const CoursesPage = lazy(() => import("./Pages/courses/Courses"));
const SubjectsPage = lazy(() => import("./Pages/subjects/Subjects"));
const ParticipantsPage = lazy(
  () => import("./Pages/participants/Participants")
);
const InstructorsPage = lazy(() => import("./Pages/instructors/Instructors"));
const ApplicationPage = lazy(() => import("./Pages/application/Application"));
const ApplicationFormPage = lazy(
  () => import("./Pages/application/ApplicationForm")
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/courses", element: <CoursesPage /> },
      { path: "/courses/:id", element: <SubjectsPage /> },
      { path: "/participants", element: <ParticipantsPage /> },
      { path: "/instructors", element: <InstructorsPage /> },
      { path: "/applications", element: <ApplicationPage /> },
      { path: "/applications/form", element: <ApplicationFormPage /> },
    ],
  },
]);
