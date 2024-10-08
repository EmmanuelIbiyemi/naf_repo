import {
  ProgramCreateType,
  ProgramResponse,
  ProgramType,
} from "../../types/programs";
import { appApi } from "./app.api";

const programApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<ProgramResponse, null>({
      query: () => "/program",
      providesTags: ["Programs"],
    }),
    addProgram: builder.mutation<ProgramResponse, ProgramCreateType>({
      query: (program: ProgramCreateType) => ({
        url: `/program`,
        method: "POST",
        body: program,
      }),
      invalidatesTags: ["Programs"],
    }),
    updateProgram: builder.mutation<ProgramResponse, ProgramType>({
      query: (program: ProgramType) => ({
        url: `/program/${program.id}`,
        method: "PUT",
        body: program,
      }),
      invalidatesTags: ["Programs"],
    }),
    deleteProgram: builder.mutation<ProgramResponse, number>({
      query: (course_id: number) => ({
        url: `/program/${course_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programs"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProgramsQuery,
  useAddProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programApi;
