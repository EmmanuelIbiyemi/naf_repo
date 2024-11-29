import { Pagination } from "../../types/pagination";
import { Programme, ProgrammeResponse } from "../../types/programmes";
import { appApi } from "./app.api";

const programmesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgrammes: builder.query<
      ProgrammeResponse,
      { department_id: number; search_term?: string } & Pagination
    >({
      query: ({ department_id, search_term, page, per_page }) =>
        `/program/department/${department_id}?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`,
      providesTags: ["Programmes"],
    }),
    getProgrammesM: builder.mutation<
      ProgrammeResponse,
      { department_id: number; search_term?: string } & Pagination
    >({
      query: ({ department_id, search_term, page, per_page }) => ({
        url: `/program/department/${department_id}?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`,
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
