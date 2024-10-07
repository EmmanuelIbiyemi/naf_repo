import {
  CourseCreateType2,
  CoursesResponse,
  CourseType2,
} from "../../types/courses";
import { appApi } from "./app.api";

const coursesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<CoursesResponse, null>({
      query: () => "/course",
      providesTags: ["Courses"],
    }),
    addCourse: builder.mutation<CoursesResponse, CourseCreateType2>({
      query: (course: CourseCreateType2) => ({
        url: `/course`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation<CoursesResponse, CourseType2>({
      query: (course: CourseType2) => ({
        url: `/course/${course.id}`,
        method: "PUT",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation<CoursesResponse, number>({
      query: (course_id: number) => ({
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
} = coursesApi;
