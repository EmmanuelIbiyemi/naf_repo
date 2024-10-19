import { Discount, DiscountResponse } from "../../types/discounts";
import { appApi } from "./app.api";

const discountApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<DiscountResponse, null>({
      query: () => "/discount",
      providesTags: ["Discounts"],
    }),
    addDiscount: builder.mutation<DiscountResponse, Discount>({
      query: (discount: Discount) => ({
        url: `/discount`,
        method: "POST",
        body: discount,
      }),
      invalidatesTags: ["Discounts"],
    }),
    updateDiscount: builder.mutation<Discount, Discount>({
      query: (discount: Discount) => ({
        url: `/discount/${discount.id}`,
        method: "PUT",
        body: discount,
      }),
      invalidatesTags: ["Discounts"],
    }),
    deleteDiscount: builder.mutation<Discount, number>({
      query: (discount_id: number) => ({
        url: `/discount/${discount_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Discounts"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDiscountsQuery,
  useAddDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi;
