import { ParticipantData } from "../../types/participants";
import { appApi } from "./app.api";

const participantsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getParticipants: builder.query<{ data: ParticipantData[] }, null>({
      query: () => `/participant`,
      providesTags: ["Participants"],
    }),
  }),
});

export const { useGetParticipantsQuery } = participantsApi;
