import {
  InstructorCreateType,
  instructorSingleResponse,
  InstructorsResponse,
  updateInstructor,
} from "../../types/instructors";
import { appApi } from "./app.api";

const instructorsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstructors: builder.query<InstructorsResponse, number>({
      query: (per_page) => `/instructor?page=1&per_page=${per_page}`,
      providesTags: ["Instructors"],
    }),
    getInstructor: builder.query<instructorSingleResponse, number>({
      query: (instructor_id) => `/instructor/${instructor_id}`,
      providesTags: ["Instructors"],
    }),
    addInstructor: builder.mutation<InstructorsResponse, InstructorCreateType>({
      query: (instructor) => ({
        url: `/instructor`,
        method: "POST",
        body: instructor,
      }),
      invalidatesTags: ["Instructors"],
    }),
    updateInstructor: builder.mutation<InstructorsResponse, updateInstructor>({
      query: (instructor) => ({
        url: `/instructor/${instructor.id}`,
        method: "PUT",
        body: instructor,
      }),
      invalidatesTags: ["Instructors"],
    }),
    deleteInstructor: builder.mutation<InstructorsResponse, number>({
      query: (instructor_id) => ({
        url: `/instructor/${instructor_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Instructors"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInstructorsQuery,
  useAddInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useGetInstructorQuery,
} = instructorsApi;
