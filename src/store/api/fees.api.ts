import { Fee, FeeCreateType, FeeResponse } from "../../types/fees";
import { appApi } from "./app.api";

const feesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLevelFees: builder.query<FeeResponse, string | null>({
      query: (level_id) => (level_id ? `/fee/level/${level_id}` : "/fee"),
      providesTags: ["Fees"],
    }),
    getFee: builder.query<FeeResponse, number>({
      query: (fee_id) => `/fee/${fee_id}`,
      providesTags: ["Fees"],
    }),
    addFee: builder.mutation<FeeResponse, FeeCreateType>({
      query: (fee) => ({
        url: `/fee`,
        method: "POST",
        body: fee,
      }),
      invalidatesTags: ["Fees"],
    }),
    updateFee: builder.mutation<FeeResponse, Fee>({
      query: (fee) => ({
        url: `/fee/${fee.id}`,
        method: "PUT",
        body: fee,
      }),
      invalidatesTags: ["Fees"],
    }),
    deleteFee: builder.mutation<FeeResponse, number>({
      query: (fee_id) => ({
        url: `/fee/${fee_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fees"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLevelFeesQuery,
  useAddFeeMutation,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
  useGetFeeQuery,
} = feesApi;
