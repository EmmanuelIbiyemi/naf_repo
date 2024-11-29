import { EligibleCreateType, EligiblesResponse } from "../../types/eligibles";
import { Pagination } from "../../types/pagination";
import { appApi } from "./app.api";

const eligiblesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getEligibles: builder.query<
      EligiblesResponse,
      Pagination & { search_term: string }
    >({
      query: ({ page, per_page, search_term }) =>
        `/applicant/eligible?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`,
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

export const {
  useGetEligiblesQuery,
  useAddEligiblesMutation,
  useDeleteEligiblesMutation,
} = eligiblesApi;
