import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "./store";

export const myBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access_token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    } else {
      const token = localStorage.getItem("access_token");
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
