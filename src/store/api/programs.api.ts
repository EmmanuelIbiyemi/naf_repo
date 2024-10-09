import {
  ProgramCourse,
  ProgramCreateType,
  ProgramResponse,
  ProgramType,
} from "../../types/programs";
import { appApi } from "./app.api";

const programApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<ProgramResponse, null>({
      query: () => "/program",
      providesTags: ["Programmes"],
    }),
    getProgram: builder.query<ProgramResponse, number>({
      query: (program_id) => `/program/${program_id}`,
      providesTags: ["Programmes"],
    }),
    addProgram: builder.mutation<ProgramResponse, ProgramCreateType>({
      query: (program) => ({
        url: `/program`,
        method: "POST",
        body: program,
      }),
      invalidatesTags: ["Programmes"],
    }),
    updateProgram: builder.mutation<ProgramResponse, ProgramType>({
      query: (program) => ({
        url: `/program/${program.id}`,
        method: "PUT",
        body: program,
      }),
      invalidatesTags: ["Programmes"],
    }),
    deleteProgram: builder.mutation<ProgramResponse, number>({
      query: (program_id) => ({
        url: `/program/${program_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programmes"],
    }),

    // Program Course
    addProgramCourse: builder.mutation<ProgramResponse, ProgramCourse>({
      query: (course) => ({
        url: `/program/course`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Programmes"],
    }),
    deleteProgramCourse: builder.mutation<
      ProgramResponse,
      { program_id: number; course_id: number }
    >({
      query: ({ course_id, program_id }) => ({
        url: `/program/${program_id}/course/${course_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programmes"],
    }),
    getProgramCourses: builder.query<
      ProgramResponse,
      {
        program_id: number;
        page: number;
        per_page: number;
      }
    >({
      query: ({ program_id, page = 1, per_page = 10 }) =>
        `/program/${program_id}/courses?page=${page}&per_page=${per_page}`,
      providesTags: ["Programmes"],
    }),
    getProgramParticipants: builder.query<
      ProgramResponse,
      {
        program_id: number;
        page: number;
        per_page: number;
      }
    >({
      query: ({ program_id, page = 1, per_page = 10 }) =>
        `/program/${program_id}/participants?page=${page}&per_page=${per_page}`,
      providesTags: ["Programmes"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProgramsQuery,
  useAddProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useAddProgramCourseMutation,
  useDeleteProgramCourseMutation,
  useGetProgramCoursesQuery,
  useGetProgramParticipantsQuery,
  useGetProgramQuery,
} = programApi;
