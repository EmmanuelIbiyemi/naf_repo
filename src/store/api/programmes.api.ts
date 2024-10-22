import { Programme, ProgrammeResponse } from "../../types/programmes";
import { appApi } from "./app.api";

const programmesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgrammes: builder.query<ProgrammeResponse, number>({
      query: (department_id) => `/program/department/${department_id}`,
      providesTags: ["Programmes"],
    }),
    getProgrammesM: builder.mutation<ProgrammeResponse, number>({
      query: (department_id) => ({
        url: `/program/department/${department_id}`,
      }),
    }),
    addProgramme: builder.mutation<ProgrammeResponse, Programme>({
      query: (programme) => ({
        url: `/program`,
        method: "POST",
        body: programme,
      }),
      invalidatesTags: ["Programmes"],
    }),
    updateProgramme: builder.mutation<Programme, Programme>({
      query: (programme) => ({
        url: `/program/${programme.id}`,
        method: "PUT",
        body: programme,
      }),
      invalidatesTags: ["Programmes"],
    }),
    deleteProgramme: builder.mutation<Programme, number>({
      query: (programme_id) => ({
        url: `/program/${programme_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programmes"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProgrammesQuery,
  useGetProgrammesMMutation,
  useAddProgrammeMutation,
  useUpdateProgrammeMutation,
  useDeleteProgrammeMutation,
} = programmesApi;
