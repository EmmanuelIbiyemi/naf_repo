import {
  Lecturer,
  LecturerCreateType,
  LecturerResponse,
} from "../../types/lecturers";
import { appApi } from "./app.api";

const lecturersApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLecturers: builder.query<LecturerResponse, null>({
      query: () => "/instructor",
      providesTags: ["Lecturers"],
    }),
    getLecturer: builder.query<LecturerResponse, number>({
      query: (lecturer_id) => `/instructor/${lecturer_id}`,
      providesTags: ["Lecturers"],
    }),
    addLecturer: builder.mutation<LecturerResponse, LecturerCreateType>({
      query: (lecturer) => ({
        url: `/instructor`,
        method: "POST",
        body: lecturer,
      }),
      invalidatesTags: ["Lecturers"],
    }),
    updateLecturer: builder.mutation<LecturerResponse, Lecturer>({
      query: (lecturer) => ({
        url: `/instructor/${lecturer.id}`,
        method: "PUT",
        body: lecturer,
      }),
      invalidatesTags: ["Lecturers"],
    }),
    deleteLecturer: builder.mutation<LecturerResponse, number>({
      query: (lecturer_id) => ({
        url: `/instructor/${lecturer_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lecturers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLecturersQuery,
  useAddLecturerMutation,
  useUpdateLecturerMutation,
  useDeleteLecturerMutation,
  useGetLecturerQuery,
} = lecturersApi;
