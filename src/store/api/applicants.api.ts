import {
  ApplicantCreateType,
  ApplicantsResponse,
  ApplicantStatusChangeType,
  ApplicantType,
} from "../../types/applicants";
import { Pagination } from "../../types/pagination";
import { appApi } from "./app.api";

const applicantsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getApplicants: builder.query<
      ApplicantsResponse,
      { program_id?: number } & Pagination
    >({
      query: ({ page = 1, per_page = 10, program_id }) =>
        `/applicant?${
          program_id ? "program_id=" + program_id : ""
        }&page=${page}&per_page=${per_page}`,
      providesTags: ["Applicants"],
    }),
    getApplicant: builder.query<ApplicantsResponse, number>({
      query: (applicant_id) => `/applicant/${applicant_id}`,
      providesTags: ["Applicants"],
    }),
    updateApplicantStatus: builder.mutation<
      ApplicantsResponse,
      ApplicantStatusChangeType
    >({
      query: (applicant) => ({
        url: `/applicant/status`,
        method: "POST",
        body: applicant,
      }),
      invalidatesTags: ["Applicants"],
    }),
    addApplicant: builder.mutation<ApplicantsResponse, ApplicantCreateType>({
      query: (applicant) => ({
        url: `/applicant`,
        method: "POST",
        body: applicant,
      }),
      invalidatesTags: ["Applicants"],
    }),
    updateApplicant: builder.mutation<ApplicantsResponse, ApplicantType>({
      query: (applicant) => ({
        url: `/applicant/${applicant.id}`,
        method: "PUT",
        body: applicant,
      }),
      invalidatesTags: ["Applicants"],
    }),
    deleteApplicant: builder.mutation<ApplicantsResponse, number>({
      query: (applicant_id) => ({
        url: `/applicant/${applicant_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Applicants"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetApplicantsQuery,
  useAddApplicantMutation,
  useUpdateApplicantMutation,
  useDeleteApplicantMutation,
  useGetApplicantQuery,
  useUpdateApplicantStatusMutation,
} = applicantsApi;
