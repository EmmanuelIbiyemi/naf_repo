import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const App = lazy(() => import("./App"));
const Login = lazy(() => import("./Pages/login/Login"));
const Dashboard = lazy(() => import("./Pages/admin/dashboard/Dashboard"));
const CoursesPage = lazy(() => import("./Pages/admin/courses/Courses"));
const SubjectsPage = lazy(() => import("./Pages/admin/subjects/Subjects"));
const StudentsPage = lazy(() => import("./Pages/admin/students/Students"));
const InstructorsPage = lazy(
  () => import("./Pages/admin/instructors/Instructors")
);
const FormsPage = lazy(() => import("./Pages/admin/application/Forms"));
const ApplicationFormPage = lazy(
  () => import("./Pages/admin/application/ApplicationForm")
);
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
      { path: "/students", element: <StudentsPage /> },
      { path: "/instructors", element: <InstructorsPage /> },
      { path: "/applications", element: <FormsPage /> },
      { path: "/applications/form", element: <ApplicationFormPage /> },
      { path: "/applications/form/preview", element: <PreviewFormPage /> },
      { path: "/applications/applicants", element: <ApplicantsPage /> },
      { path: "/applications/cbt", element: <CBT /> },
      { path: "/applications/cbt/questions", element: <CBTQuestionsPage /> },
    ],
  },
]);
