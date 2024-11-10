import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "./store";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout, setAccessToken } from "./auth.slice";

export const myBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.access_token ||
      localStorage.getItem("access_token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await myBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to refresh the token
    const refreshToken = localStorage.getItem("refresh_token");
    const user = JSON.parse(localStorage.getItem("user") as string);

    if (refreshToken && user) {
      const refreshResult = await myBaseQuery(
        {
          url: "/user/refresh",
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          body: { email: user.email },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Save the new access token and retry the original query
        const newAccessToken = (refreshResult.data as { access_token: string })
          .access_token;
        api.dispatch(setAccessToken({ access_token: newAccessToken }));
        localStorage.setItem("access_token", newAccessToken);

        // Retry the original request with the new token
        result = await myBaseQuery(args, api, extraOptions);
      } else {
        // Refresh token failed, clear stored tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        api.dispatch(logout());
      }
    }
  }

  return result;
};
