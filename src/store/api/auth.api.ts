import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { UserLoginType, UserType } from "../../types/users";
import { logout } from "../auth.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState).auth.access_token;
    if (access_token) {
      headers.set("authorization", `Bearer ${access_token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandling: BaseQueryFn<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  string | FetchArgs | any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  let retryCount = 0;
  while (
    result.error &&
    "originalStatus" in result.error &&
    result.error.originalStatus === 502 &&
    retryCount < 1
  ) {
    // increment and retry
    retryCount++;
    result = await baseQuery(args, api, extraOptions);
  }

  if (result.error && result.error.status === 401) {
    // log the user out if refresh token isnt found
    alert("Session expired, Please signin to continue");
    api.dispatch(logout());
    api.dispatch(authApiSlice.util.resetApiState());
  }

  return result;
};

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Users", "Notifications"],
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        access_token: string;
        message: string;
        refresh_token: string;
        status: string;
        user: UserType;
      },
      UserLoginType
    >({
      query: (values) => ({
        url: "/user/login",
        method: "POST",
        body: { ...values },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
