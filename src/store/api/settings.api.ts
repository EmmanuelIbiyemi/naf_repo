import { UserType } from "../../types/users";
import { appApi } from "./app.api";

const settingsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstructor: builder.query<{ data: UserType }, unknown>({
      query: (user_id) => `/instructor/${user_id}`,
    }),
    updateInstructorInfo: builder.mutation<
      unknown,
      { values: unknown; id: number | undefined }
    >({
      query: ({ values, id }) => ({
        url: `/instructor/${id}`,
        method: "PUT",
        body: values,
      }),
      //   invalidatesTags: [""],
    }),
  }),
});

export const { useGetInstructorQuery, useUpdateInstructorInfoMutation } =
  settingsApi;
