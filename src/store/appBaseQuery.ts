import { fetchBaseQuery } from "@reduxjs/toolkit/query";
// import type { RootState } from "./store";

export const myBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    // Temp
    const token = "sdfada"; // Temp
    // const token = (getState() as RootState).auth.access_token;
    //   prepareHeaders: (headers, { getState }) => {

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    } else {
      const token = localStorage.getItem("access_token");
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
