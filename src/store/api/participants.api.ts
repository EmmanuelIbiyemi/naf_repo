import { ParticipantData } from "../../types/participants";
import { appApi } from "./app.api";

const participantsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getParticipants: builder.query<{ data: ParticipantData[] }, null>({
      query: () => `/participant`,
      providesTags: ["Participants"],
    }),
    getCourseParticipants: builder.query<
      { data: ParticipantData[] },
      { course_id: number | null }
    >({
      query: ({ course_id }) => `/participant/course/${course_id}`,
      providesTags: ["Participants"],
    }),
  }),
});

export const { useGetParticipantsQuery, useGetCourseParticipantsQuery } =
  participantsApi;
