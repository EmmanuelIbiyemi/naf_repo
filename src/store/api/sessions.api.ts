import {
  SessionCreateType,
  SessionsResponse,
  SessionType,
} from "../../types/sessions";
import { appApi } from "./app.api";

const sessionsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<SessionsResponse, null>({
      query: () => "/session",
      providesTags: ["Sessions"],
    }),
    getSession: builder.query<SessionsResponse, number>({
      query: (session_id) => `/session/${session_id}`,
      providesTags: ["Sessions"],
    }),
    getCurrentSession: builder.query<SessionsResponse, null>({
      query: () => `/session/current`,
      providesTags: ["Sessions"],
    }),
    addSession: builder.mutation<SessionsResponse, SessionCreateType>({
      query: (session) => ({
        url: `/session`,
        method: "POST",
        body: session,
      }),
      invalidatesTags: ["Sessions"],
    }),
    updateSession: builder.mutation<SessionsResponse, SessionType>({
      query: (session) => ({
        url: `/session/${session.id}`,
        method: "PUT",
        body: session,
      }),
      invalidatesTags: ["Sessions"],
    }),
    deleteSession: builder.mutation<SessionsResponse, number>({
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
