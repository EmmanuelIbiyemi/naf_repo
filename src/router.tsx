/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

// Admin

const App = lazy(() => import("./App"));
const Login = lazy(() => import("./Pages/login/Login"));
const Dashboard = lazy(() => import("./Pages/admin/dashboard/Dashboard"));
const AdminAcademicsPage = lazy(
  () => import("./Pages/admin/academics/Academics")
);
const FacultiesPage = lazy(
  () => import("./Pages/admin/academics/faculties/Faculties")
);
const DepartmentsPage = lazy(
  () => import("./Pages/admin/academics/departments/Departments")
);
const ProgrammesPage = lazy(
  () => import("./Pages/admin/academics/programmes/Programmes")
);
const CoursesPage = lazy(
  () => import("./Pages/admin/academics/courses/Courses")
);
const StudentsPage = lazy(() => import("./Pages/admin/students/Students"));
const InstructorsPage = lazy(
  () => import("./Pages/admin/instructors/Instructors")
);
const FormsPage = lazy(() => import("./Pages/admin/application/FormsPage"));
const AddFormPage = lazy(() => import("./Pages/admin/application/AddFormPage"));
const PreviewFormPage = lazy(
  () => import("./Pages/admin/application/PreviewForm")
);
const ApplicantsPage = lazy(
  () => import("./Pages/admin/applicants/ApplicantsPage")
);
const CBT = lazy(() => import("./Pages/admin/cbt/CBT"));
const CBTQuestionsPage = lazy(
  () => import("./Pages/admin/cbtQuestions/CBTQuestions")
);
const AdminSettingsPage = lazy(() => import("./Pages/admin/settings/Settings"));
const MediaLibrary = lazy(() => import("./Pages/admin/media/MediaLibrary"));
const Page = lazy(() => import("./Pages/admin/page/Page"));
const LevelsPage = lazy(() => import("./Pages/admin/academics/levels/Levels"));

// Instructor

const InstructorDashboard = lazy(
  () => import("./Pages/instructor/dashboard/Dashboard")
);
const InstructorCoursesPage = lazy(
  () => import("./Pages/instructor/courses/Courses")
);
const CoursesLayout = lazy(() => import("./components/CoursesLayout"));
const CoursesDetailsPage = lazy(
  () => import("./Pages/instructor/courses/Details")
);
const CoursesParicipantsPage = lazy(
  () => import("./Pages/instructor/courses/Participants")
);
const SettingsPage = lazy(() => import("./Pages/instructor/settings/Settings"));

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
      { path: "/students", element: <StudentsPage /> },
      { path: "/instructors", element: <InstructorsPage /> },
      { path: "/applications", element: <FormsPage /> },
      { path: "/applications/form", element: <AddFormPage /> },
      { path: "/applications/form/preview", element: <PreviewFormPage /> },
      { path: "/applications/applicants", element: <ApplicantsPage /> },
      { path: "/applications/cbt", element: <CBT /> },
      { path: "/applications/cbt/questions", element: <CBTQuestionsPage /> },
      {
        path: "/academics",
        element: <AdminAcademicsPage />,
        children: [
          { path: "", element: <FacultiesPage /> },
          { path: "departments", element: <DepartmentsPage /> },
          { path: "programmes", element: <ProgrammesPage /> },
          { path: "courses", element: <CoursesPage /> },
          { path: "levels", element: <LevelsPage /> },
        ],
      },
      {
        path: "/settings",
        element: <AdminSettingsPage />,
        children: [
          { path: "", element: <MediaLibrary /> },

          { path: "page/:name", element: <Page /> },
        ],
      },
    ],
  },
  {
    path: "/instructor",
    element: <App />,
    children: [
      { path: "/instructor", element: <InstructorDashboard /> },
      { path: "/instructor/settings", element: <SettingsPage /> },
      { path: "/instructor/courses", element: <InstructorCoursesPage /> },

      {
        path: "/instructor/courses/:id",
        element: <CoursesLayout />,
        children: [
          {
            path: "details",
            element: <CoursesDetailsPage />,
          },
          {
            path: "participants",
            element: <CoursesParicipantsPage />,
          },
          // { path: "/instructor/courses/:id", element: <CoursesDetailsPage /> },
        ],
      },
      // { path: "/students", element: <StudentsPage /> },
      // { path: "/instructors", element: <InstructorsPage /> },
      // { path: "/applications", element: <FormsPage /> },
      // { path: "/applications/form", element: <AddFormPage /> },
      // { path: "/applications/form/preview", element: <PreviewFormPage /> },
      // { path: "/applications/applicants", element: <ApplicantsPage /> },
      // { path: "/applications/cbt", element: <CBT /> },
      // { path: "/applications/cbt/questions", element: <CBTQuestionsPage /> },
    ],
  },
]);
