import {
  CourseCreateType,
  CourseInstructor,
  CoursesResponse,
  CourseType,
} from "../../types/courses";
import { appApi } from "./app.api";

const coursesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<CoursesResponse, null>({
      query: () => "/course",
      providesTags: ["Courses"],
    }),
    getCourse: builder.query<CoursesResponse, number>({
      query: (course_id) => `/course/${course_id}`,
      providesTags: ["Courses"],
    }),
    addCourse: builder.mutation<CoursesResponse, CourseCreateType>({
      query: (course) => ({
        url: `/course`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    addCourseInstructor: builder.mutation<CoursesResponse, CourseInstructor>({
      query: (course_instructor) => ({
        url: `/course/instructor`,
        method: "POST",
        body: course_instructor,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation<CoursesResponse, CourseType>({
      query: (course) => ({
        url: `/course/${course.id}`,
        method: "PUT",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation<CoursesResponse, number>({
      query: (course_id) => ({
        url: `/course/${course_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAddCourseInstructorMutation,
  useGetCourseQuery,
} = coursesApi;
