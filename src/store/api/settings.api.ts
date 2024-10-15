import { appApi } from "./app.api";

const settingsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserInfo: builder.mutation<unknown, unknown>({
      query: (values) => ({
        url: `/user/me`,
        method: "PUT",
        body: values,
      }),
      //   invalidatesTags: [""],
    }),
  }),
});

export const { useUpdateUserInfoMutation } = settingsApi;
