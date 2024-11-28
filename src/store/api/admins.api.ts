import { Admin, AdminCreateType, AdminResponse } from "../../types/admins";
import { Pagination } from "../../types/pagination";
import { appApi } from "./app.api";

const adminsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<
      AdminResponse,
      Pagination & { search_term?: string }
    >({
      query: ({ search_term, page, per_page }) =>
        `/admin?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`,
      providesTags: ["Admins"],
    }),
    getAdmin: builder.query<{ data: Admin }, number>({
      query: (admin_id) => `/admin/${admin_id}`,
      providesTags: ["Admins"],
    }),
    addAdmin: builder.mutation<AdminResponse, AdminCreateType>({
      query: (admin) => ({
        url: `/admin`,
        method: "POST",
        body: admin,
      }),
      invalidatesTags: ["Admins"],
    }),
    updateAdmin: builder.mutation<AdminResponse, Admin>({
      query: (admin) => ({
        url: `/admin/${admin.id}`,
        method: "PUT",
        body: admin,
      }),
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: builder.mutation<AdminResponse, number>({
      query: (admin_id) => ({
        url: `/admin/${admin_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminsQuery,
  useAddAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminQuery,
} = adminsApi;
