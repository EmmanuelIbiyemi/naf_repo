import {
  CourseCreateType,
  CourseInstructor,
  CoursesResponse,
  CourseType,
} from "../../types/courses";
import { LevelCourseCreateType, LevelsResponse } from "../../types/levels";
import { appApi } from "./app.api";

type Pagination = {
  page?: number;
  per_page?: number;
};

const coursesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesByLevel: builder.query<
      CoursesResponse,
      Pagination & { level_id: number }
    >({
      query: ({ page = 1, per_page = 10, level_id }) =>
        `level/${level_id}/courses?page=${page}&per_page=${per_page}`,
      providesTags: ["Courses"],
    }),
    getCourses: builder.query<CoursesResponse, null>({
      query: () => `/course`,
      providesTags: ["Courses"],
    }),
    getInstructorCourses: builder.query<CoursesResponse, null>({
      query: () => `/course/instructor`,
      providesTags: ["Courses"],
    }),
    getCourse: builder.query<{ data: CourseType }, number>({
      query: (course_id) => `/course/${course_id}`,
      providesTags: ["Courses"],
    }),
    addCourse: builder.mutation<{ data: CourseType }, CourseCreateType>({
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

    addLevelCourse: builder.mutation<LevelsResponse, LevelCourseCreateType>({
      query: (level) => ({
        url: `/level/course`,
        method: "POST",
        body: level,
      }),
      invalidatesTags: ["Levels", "Courses"],
    }),
    deleteLevelCourse: builder.mutation<
      LevelsResponse,
      { course_id: number; level_id: number }
    >({
      query: ({ level_id, course_id }) => ({
        url: `/level/${level_id}/course/${course_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Levels"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCoursesByLevelQuery,
  useGetCoursesQuery,
  useGetInstructorCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAddCourseInstructorMutation,
  useGetCourseQuery,
  useAddLevelCourseMutation,
  useDeleteLevelCourseMutation,
} = coursesApi;
