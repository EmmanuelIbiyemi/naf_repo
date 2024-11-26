import {
  CourseCreateType,
  CourseInstructor,
  CourseResponse,
  CoursesResponse,
  CourseType,
} from "../../types/courses";
import {
  LevelCourseCreateType,
  LevelResponse,
  LevelsResponse,
} from "../../types/levels";
import { appApi } from "./app.api";

interface GetCoursesParams {
  semester?: string;
  name?: string;
  code?: string;
  page?: number;
}

type Pagination = {
  page?: number;
  per_page?: number;
};

const coursesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesByLevel: builder.query<
      CoursesResponse,
      { level_id: number } & Pagination
    >({
      query: ({ level_id, page = 1, per_page = 10 }) =>
        `level/${level_id}/courses?page=${page}&per_page=${per_page}`,
      providesTags: ["Courses"],
    }),
    getCourses: builder.query<
      CoursesResponse,
      (GetCoursesParams & Pagination) | null
    >({
      query: (params) => ({
        url: "/course",
        params: {
          semester: params?.semester || "",
          name: params?.name || "",
          code: params?.code || "",
          page: params?.page || "",
          per_page: params?.per_page || 10,
        },
      }),
      providesTags: ["Courses"],
    }),
    getInstructorCourses: builder.query<
      CoursesResponse,
      { page: number; per_page: number }
    >({
      query: ({ page, per_page }) =>
        `/course/instructor?page=${page}&per_page=${per_page}`,
      providesTags: ["Courses"],
    }),
    getCourse: builder.query<CourseResponse, number>({
      query: (course_id) => `/course/${course_id}`,
      providesTags: ["Courses"],
    }),
    addCourse: builder.mutation<CourseResponse, CourseCreateType>({
      query: (course) => ({
        url: `/course`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    addCourseInstructor: builder.mutation<CourseResponse, CourseInstructor>({
      query: (course_instructor) => ({
        url: `/course/instructor`,
        method: "POST",
        body: course_instructor,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation<CourseResponse, CourseType>({
      query: (course) => ({
        url: `/course/${course.id}`,
        method: "PUT",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation<CourseResponse, number>({
      query: (course_id) => ({
        url: `/course/${course_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    addLevelCourse: builder.mutation<LevelResponse, LevelCourseCreateType>({
      query: (course) => ({
        url: `/level/course`,
        method: "POST",
        body: course,
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
