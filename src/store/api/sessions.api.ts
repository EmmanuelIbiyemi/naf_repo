import {
  SessionCreateType,
  SessionResponse,
  SessionsResponse,
  SessionType,
} from "../../types/sessions";
import { appApi } from "./app.api";

interface GetSessionsParams {
  search_term?: string;
  page?: number;
  per_page?: number;
}

const sessionsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<SessionsResponse, GetSessionsParams | undefined>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search_term) queryParams.append('search_term', params.search_term);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        return `/session${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      },
      providesTags: ["Sessions"],
    }),
    getSession: builder.query<SessionResponse, number>({
      query: (session_id) => `/session/${session_id}`,
      providesTags: ["Sessions"],
    }),
    getCurrentSession: builder.query<SessionResponse, null>({
      query: () => `/session/current`,
      providesTags: ["Sessions"],
    }),
    addSession: builder.mutation<SessionResponse, SessionCreateType>({
      query: (session) => ({
        url: `/session`,
        method: "POST",
        body: session,
      }),
      invalidatesTags: ["Sessions"],
    }),
    updateSession: builder.mutation<SessionResponse, SessionType>({
      query: (session) => ({
        url: `/session/${session.id}`,
        method: "PUT",
        body: session,
      }),
      invalidatesTags: ["Sessions"],
    }),
    deleteSession: builder.mutation<SessionResponse, number>({
      query: (session_id) => ({
        url: `/session/${session_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSessionsQuery,
  useLazyGetSessionsQuery,
  useAddSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionQuery,
  useGetCurrentSessionQuery,
} = sessionsApi;
