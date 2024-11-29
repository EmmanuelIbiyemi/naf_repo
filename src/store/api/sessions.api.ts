import {
  SessionCreateType,
  SessionResponse,
  SessionsResponse,
  SessionType,
} from "../../types/sessions";
import { appApi } from "./app.api";

const sessionsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<SessionsResponse, { search_term?: string }>({
      query: ({ search_term }) =>
        `/session${search_term ? "?search_term=" + search_term : ""}`,
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
  useAddSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionQuery,
  useGetCurrentSessionQuery,
} = sessionsApi;
