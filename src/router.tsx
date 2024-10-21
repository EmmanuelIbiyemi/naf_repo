/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Page from "./Pages/admin/page/Page";
import ReportsExpanded from "./Pages/instructor/reports/ReportsExpanded";

// Admin

const App = lazy(() => import("./App"));
const Login = lazy(() => import("./Pages/login/Login"));
const Dashboard = lazy(() => import("./Pages/admin/dashboard/Dashboard"));
const ProgramPage = lazy(() => import("./Pages/admin/programs/Programs"));
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
const SubjectsPage = lazy(() => import("./Pages/admin/subjects/Subjects"));
const StudentsPage = lazy(() => import("./Pages/admin/students/Students"));
const InstructorsPage = lazy(
  () => import("./Pages/admin/instructors/Instructors")
);
const FormsPage = lazy(() => import("./Pages/admin/application/FormsPage"));
const AddFormPage = lazy(() => import("./Pages/admin/application/AddForm"));
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
const PostPage = lazy(() => import("./Pages/admin/application copy/PostPage"));
const AddPostPage = lazy(
  () => import("./Pages/admin/application copy/AddPost")
);
const PreviewPostPage = lazy(
  () => import("./Pages/admin/application copy/PreviewPost")
);

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
const CoursesNotesPage = lazy(
  () => import("./Pages/instructor/courses/notes/Notes")
);
const CreateNotePage = lazy(
  () => import("./Pages/instructor/courses/notes/NewNote")
);
const CoursesTestsPage = lazy(
  () => import("./Pages/instructor/courses/cbt/Tests")
);
const InputQuestionsManually = lazy(
  () => import("./Pages/instructor/courses/cbt/stepmodals/ManualInputQuestions")
);
const ReportsPage = lazy(() => import("./Pages/instructor/reports/Reports"));
const LiveClassesPage = lazy(
  () => import("./Pages/instructor/classes/LiveClasses")
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
      { path: "/programs", element: <ProgramPage /> },
      { path: "/courses", element: <CoursesPage /> },
      { path: "/courses/:id", element: <SubjectsPage /> },
      { path: "/courses/:id", element: <SubjectsPage /> },
      { path: "/students", element: <StudentsPage /> },
      { path: "/instructors", element: <InstructorsPage /> },
      { path: "/applications", element: <FormsPage /> },
      { path: "/applications/form", element: <AddFormPage /> },
      { path: "/applications/form/preview", element: <PreviewFormPage /> },
      { path: "/applications/applicants", element: <ApplicantsPage /> },
      { path: "/applications/cbt", element: <CBT /> },
      { path: "/applications/cbt/questions", element: <CBTQuestionsPage /> },
      { path: "/posts", element: <PostPage /> },
      { path: "/posts/add", element: <AddPostPage /> },
      { path: "/post/preview", element: <PreviewPostPage /> },
      {
        path: "/academics",
        element: <AdminAcademicsPage />,
        children: [
          { path: "", element: <FacultiesPage /> },
          { path: "departments", element: <DepartmentsPage /> },
          { path: "programmes", element: <ProgrammesPage /> },
          { path: "courses", element: <CoursesPage /> },
          { path: "page/:name", element: <Page /> },
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
            path: "students",
            element: <CoursesParicipantsPage />,
          },
          {
            path: "notes",
            element: <CoursesNotesPage />,
          },
          { path: "notes/new", element: <CreateNotePage /> },
          { path: "tests", element: <CoursesTestsPage /> },
          { path: "classes", element: <LiveClassesPage /> },
          { path: "tests/manual-input", element: <InputQuestionsManually /> },
        ],
      },

      { path: "/instructor/reports", element: <ReportsPage /> },
      { path: "/instructor/reports/:id", element: <ReportsExpanded /> },
      { path: "classes", element: <LiveClassesPage /> },
      { path: "/instructor/post", element: <PostPage /> },
      { path: "/instructor/posts/add", element: <AddPostPage /> },
      { path: "/instructor/post/preview", element: <PreviewPostPage /> },

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
