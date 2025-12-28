import {
  InstructorCreateType,
  instructorSingleResponse,
  InstructorsResponse,
  updateInstructor,
} from "../../types/instructors";
import { appApi } from "./app.api";

interface GetInstructorsParams {
  page?: number;
  per_page?: number;
  search_term?: string;
}

const instructorsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstructors: builder.query<InstructorsResponse, GetInstructorsParams | undefined>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', (params?.page || 1).toString());
        queryParams.append('per_page', (params?.per_page || 10).toString());
        if (params?.search_term) queryParams.append('search_term', params.search_term);
        return `/instructor?${queryParams.toString()}`;
      },
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
  useLazyGetInstructorsQuery,
  useAddInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useGetInstructorQuery,
} = instructorsApi;
