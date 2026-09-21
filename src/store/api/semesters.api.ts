import {
  SemesterCreateType,
  SemesterResponse,
  SemestersResponse,
  SemesterType,
} from "../../types/semesters";
import { appApi } from "./app.api";

interface GetSemestersParams {
  session_id?: number;
  search_term?: string;
  page?: number;
  per_page?: number;
}

const semestersApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query<SemestersResponse, GetSemestersParams | undefined>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.session_id) queryParams.append('session_id', params.session_id.toString());
        if (params?.search_term) queryParams.append('search_term', params.search_term);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        return `/semester${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      },
      providesTags: ["Semesters", "Sessions"],
    }),
    getSemester: builder.query<SemesterResponse, number>({
      query: (semester_id) => `/semester/${semester_id}`,
      providesTags: ["Semesters", "Sessions"],
    }),
    getCurrentSemester: builder.query<SemesterResponse, null>({
      query: () => `/semester/current`,
      providesTags: ["Semesters", "Sessions"],
    }),
    addSemester: builder.mutation<SemesterResponse, SemesterCreateType>({
      query: (semester) => ({
        url: `/semester`,
        method: "POST",
        body: semester,
      }),
      invalidatesTags: ["Semesters", "Sessions"],
    }),
    updateSemester: builder.mutation<SemesterResponse, SemesterType>({
      query: (semester) => ({
        url: `/semester/${semester.id}`,
        method: "PUT",
        body: semester,
      }),
      invalidatesTags: ["Semesters", "Sessions"],
    }),
    deleteSemester: builder.mutation<SemesterResponse, number>({
      query: (semester_id) => ({
        url: `/semester/${semester_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Semesters", "Sessions"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSemestersQuery,
  useLazyGetSemestersQuery,
  useAddSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
  useGetSemesterQuery,
  useGetCurrentSemesterQuery,
} = semestersApi;
