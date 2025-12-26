import {
  ResultCreateType,
  ResultResponse,
  StudentResultResponse,
  ResultTaskStartResponse,
  ResultTaskStatusResponse,
} from "../../types/results.ts";
import { StudentTranscriptResponse } from "../../types/transcript.ts";
import { appApi } from "./app.api.ts";

const resultApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate Result
    generateResult: builder.mutation<ResultTaskStartResponse, ResultCreateType>({
      query: (resultData: ResultCreateType) => ({
        url: `/result`,
        method: "POST",
        body: resultData,
      }),
      invalidatesTags: ["Results"],
    }),

    // Check Result Task
    checkResultTask: builder.query<ResultTaskStatusResponse, string>({
      query: (taskId: string) => `/result/task/${taskId}`,
      providesTags: ["ResultTasks"],
    }),

    // Get All Results
    getResults: builder.query<
      ResultResponse,
      {
        department_id: number;
        level_id: number;
        session: string;
        semester: string;
      }
    >({
      query: (params) => ({
        url: `/result`,
        params,
      }),
      providesTags: ["Results"],
    }),

    // Get Single Result
    getResult: builder.query<ResultResponse, number>({
      query: (result_id) => `/result/${result_id}`,
      providesTags: ["Results"],
    }),

    // Get Student Result
    studentResult: builder.query<
      StudentResultResponse,
      {
        participant_id: number;
        session: string;
        semester: string;
      }
    >({
      query: ({ participant_id, session, semester }) => ({
        url: `/result`,
        params: { participant_id, session, semester },
      }),
      providesTags: ["Results"],
    }),

    // Get Transcript
    getStudentTranscript: builder.query<StudentTranscriptResponse, number>({
      query: (participant_id) => ({
        url: `/result/transcript`,
        params: { participant_id },
      }),
      providesTags: ["Transcripts"],
    }),

    getStudentTranscriptM: builder.mutation<StudentTranscriptResponse, number>({
      query: (participant_id) => ({
        url: `/result/transcript`,
        params: { participant_id },
      }),
    }),

    // Delete Single Result
    deleteResult: builder.mutation<ResultResponse, number>({
      query: (result_id: number) => ({
        url: `/result/${result_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Results"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGenerateResultMutation,
  useCheckResultTaskQuery,
  useGetResultsQuery,
  useGetResultQuery,
  useStudentResultQuery,
  useGetStudentTranscriptQuery,
  useGetStudentTranscriptMMutation,
  useDeleteResultMutation,
} = resultApi;
