import {
  Admin,
  AdminCreateType,
  AdminResponse,
} from "../../types/admins";
import { appApi } from "./app.api";

const adminsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<AdminResponse, null>({
      query: () => "/admin",
      providesTags: ["Admins"],
    }),
    getAdmin: builder.query<AdminResponse, number>({
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
