/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import ReportsExpanded from "./Pages/instructor/reports/ReportsExpanded";
import PostPage from "./Pages/admin/post/AddPostPage";

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
const LevelsPage = lazy(() => import("./Pages/admin/academics/levels/Levels"));
const CoursesPage = lazy(
  () => import("./Pages/admin/academics/courses/Courses")
);
const AdminUsersPage = lazy(() => import("./Pages/admin/users/Users"));
const LecturersPage = lazy(
  () => import("./Pages/admin/users/lecturers/Lecturers")
);
const StudentsPage = lazy(
  () => import("./Pages/admin/users/students/Students")
);
const AdminsPage = lazy(() => import("./Pages/admin/users/admins/Admins"));
const AdminFeesPage = lazy(() => import("./Pages/admin/fees/AdminFees"));
const DeptFeesPage = lazy(() => import("./Pages/admin/fees/Dept/Fees"));
const DiscountFeesPage = lazy(
  () => import("./Pages/admin/fees/Discounts/Discounts")
);
const AdminGradingPage = lazy(
  () => import("./Pages/admin/grading/AdminGrading")
);
const GradesPage = lazy(() => import("./Pages/admin/grading/grades/Grades"));
const ScoresPage = lazy(() => import("./Pages/admin/grading/scores/Scores"));

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

const CoursesTestParticipantsPage = lazy(
  () => import("./Pages/instructor/courses/cbt/TestParticipants")
);
const CoursesViewParticipantDetailsPage = lazy(
  () => import("./Pages/instructor/courses/cbt/ViewQuizAnswers")
);
const ReportsPage = lazy(() => import("./Pages/instructor/reports/Reports"));
const LiveClassesPage = lazy(
  () => import("./Pages/instructor/classes/LiveClasses")
);
const InstructorOfflineScoresPage = lazy(
  () => import("./Pages/instructor/courses/cbt/offlineScores/OfflineScores")
);
const SettingsPage = lazy(() => import("./Pages/instructor/settings/Settings"));

const StudentDashboard = lazy(
  () => import("./Pages/student/dashboard/Dashboard")
);
const StudentOverview = lazy(() => import("./Pages/student/overview/Overview"));
const StudentCourses = lazy(
  () => import("./Pages/student/studentCourses/StudentCourses")
);
const StudentExamCard = lazy(
  () => import("./Pages/student/studentCourses/examCard/ExamCard")
);
const StudentCourseForm = lazy(
  () => import("./Pages/student/studentCourses/courseForm/CourseForm")
);
const StudentEnroll = lazy(
  () => import("./Pages/student/studentCourses/enroll/EnrollCourses")
);
const StudentCourseDetails = lazy(
  () => import("./Pages/student/studentCourses/courseDetails/CourseDetails")
);
const StudentCourseNote = lazy(
  () => import("./Pages/student/studentCourses/courseDetails/Notes/Notes")
);
const StudentCourseSchedule = lazy(
  () => import("./Pages/student/studentCourses/courseDetails/Schedule/Schedule")
);
const StudentReports = lazy(() => import("./Pages/student/reports/Reports"));
const StudentSettings = lazy(() => import("./Pages/student/settings/Settings"));
// const AnnouncementPage = lazy(
//   () => import("./Pages/instructor/announcements/Announcements")
// );
// const AddAnnouncementPage = lazy(
//   () => import("./Pages/instructor/announcements/posts/AddPost")
// );
const PreviewAnnouncementPage = lazy(
  () => import("./Pages/instructor/announcements/posts/PreviewPost")
);
const Posts = lazy(() => import("./Pages/admin/posts/PostsPage"));

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
      { path: "/instructors", element: <InstructorsPage /> },
      { path: "/applications", element: <FormsPage /> },
      { path: "/form/:form_id", element: <AddFormPage /> },
      { path: "/form/:form_id/preview", element: <PreviewFormPage /> },
      { path: "/applicants", element: <ApplicantsPage /> },
      { path: "/cbt", element: <CBT /> },
      { path: "/cbt/:subject_id", element: <CBTQuestionsPage /> },
      {
        path: "/academics",
        element: <AdminAcademicsPage />,
        children: [
          { path: "", element: <FacultiesPage /> },
          { path: ":faculty_id", element: <DepartmentsPage /> },
          { path: ":faculty_id/:department_id", element: <ProgrammesPage /> },
          {
            path: ":faculty_id/:department_id/:program_id",
            element: <LevelsPage />,
          },
          {
            path: ":faculty_id/:department_id/:program_id/:level_id",
            element: <CoursesPage />,
          },
        ],
      },
      {
        path: "/users",
        element: <AdminUsersPage />,
        children: [
          { path: "", element: <AdminsPage /> },
          { path: "lecturers", element: <LecturersPage /> },
          { path: "students", element: <StudentsPage /> },
          { path: "page/:name", element: <Page /> },
        ],
      },
      {
        path: "/fees",
        element: <AdminFeesPage />,
        children: [
          { path: "", element: <DeptFeesPage /> },
          { path: "discount", element: <DiscountFeesPage /> },
          { path: "page/:name", element: <Page /> },
        ],
      },
      {
        path: "/grading",
        element: <AdminGradingPage />,
        children: [
          { path: "", element: <GradesPage /> },
          { path: "scores", element: <ScoresPage /> },
          { path: "page/:name", element: <Page /> },
        ],
      },
      {
        path: "/settings",
        element: <AdminSettingsPage />,
        children: [
          { path: "", element: <MediaLibrary /> },

          { path: "page/:name", element: <Page /> },
          { path: "posts", element: <Posts /> },
          { path: "post", element: <PostPage /> },
          { path: "post/:post_id", element: <PostPage /> },
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
          {
            path: "tests/:testId",
            element: <CoursesTestParticipantsPage />,
          },
          {
            path: "tests/:testId/detail/:id",
            element: <CoursesViewParticipantDetailsPage />,
          },
          { path: "classes", element: <LiveClassesPage /> },
          { path: "tests/manual-input", element: <InputQuestionsManually /> },
        ],
      },
      { path: "/instructor/reports", element: <ReportsPage /> },
      { path: "/instructor/reports/:id", element: <ReportsExpanded /> },
      { path: "classes", element: <LiveClassesPage /> },
      {
        path: "/instructor/posts/preview",
        element: <PreviewAnnouncementPage />,
      },
      {
        path: "/instructor/offline-scores",
        element: <InstructorOfflineScoresPage />,
      },
    ],
  },

  {
    path: "/student",
    element: <App />,
    children: [
      { path: "dashboard", element: <StudentDashboard /> },
      { path: "overview", element: <StudentOverview /> },
      { path: "courses", element: <StudentCourses /> },
      { path: "courses/exam-card", element: <StudentExamCard /> },
      { path: "courses/course-form", element: <StudentCourseForm /> },
      { path: "courses/add-course", element: <StudentEnroll /> },
      {
        path: "courses/details",
        element: <StudentCourseDetails />,
        children: [
          { path: "notes", element: <StudentCourseNote /> },
          { path: "schedule", element: <StudentCourseSchedule /> },
        ],
      },
      { path: "reports", element: <StudentReports /> },
      { path: "live-class", element: <CoursesPage /> },
      { path: "settings", element: <StudentSettings /> },
    ],
  },
]);
