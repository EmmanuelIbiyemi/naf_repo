import { EligibleCreateType, EligiblesResponse } from "../../types/eligibles";
import { appApi } from "./app.api";

const eligiblesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getEligibles: builder.query<EligiblesResponse, null>({
      query: () => "/applicant/eligible",
      providesTags: ["Eligibles"],
    }),
    addEligibles: builder.mutation<EligiblesResponse, EligibleCreateType>({
      query: (eligibles) => ({
        url: `/applicant/eligible`,
        method: "POST",
        body: eligibles,
      }),
      invalidatesTags: ["Eligibles"],
    }),
    deleteEligibles: builder.mutation<EligiblesResponse, number>({
      query: (eligible_id) => ({
        url: `/applicant/eligible/${eligible_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Eligibles"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetEligiblesQuery, useAddEligiblesMutation } = eligiblesApi;
