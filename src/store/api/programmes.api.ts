import {
  Programme,
  ProgrammeResponse
} from "../../types/programmes";
import { appApi } from "./app.api";

const programmesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgrammes: builder.query<ProgrammeResponse, null>({
      query: () => "/programme",
      providesTags: ["Programmes"],
    }),
    addProgramme: builder.mutation<ProgrammeResponse, Programme>({
      query: (programme: Programme) => ({
        url: `/programme`,
        method: "POST",
        body: programme,
      }),
      invalidatesTags: ["Programmes"],
    }),
    updateProgramme: builder.mutation<Programme, Programme>({
      query: (programme: Programme) => ({
        url: `/programme/${programme.id}`,
        method: "PUT",
        body: programme,
      }),
      invalidatesTags: ["Programmes"],
    }),
    deleteProgramme: builder.mutation<Programme, number>({
      query: (programme_id: number) => ({
        url: `/programme/${programme_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programmes"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProgrammesQuery,
  useAddProgrammeMutation,
  useUpdateProgrammeMutation,
  useDeleteProgrammeMutation,
} = programmesApi;
