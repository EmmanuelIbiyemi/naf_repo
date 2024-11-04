import {
  AssessmentResponse,
  CreateQuiz,
  FileUploadQuestionResponse,
  ManualUploadQuestion,
  ManualUploadQuestionResponse,
  QuizzesResponse,
  shareQuizInput,
} from "../../types/quizzes";
import { appApi } from "./app.api";

// Add these new types for the new endpoints
interface SingleQuizResponse {
  data: QuizzesResponse & {
    assessments: Array<{
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
      questions: Array<{
        id: number;
        body: string;
        created_at: string;
        updated_at: string;
        options: Array<{
          id: number;
          body: string;
          is_answer: boolean;
          created_at: string;
          updated_at: string;
        }>;
      }>;
    }>;
  };
  message: string;
  status: string;
}

interface QuizResultResponse {
  data: {
    // Add your result type here based on your API response
    score: number;
    total: number;
    // ... other result fields
  };
  message: string;
  status: string;
}

const quizzesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoints
    getQuizzes: builder.query<{ data: QuizzesResponse[] }, null>({
      query: () => `/quiz`,
      providesTags: ["Quiz"],
    }),

    getCourseQuizzes: builder.query<
      { data: QuizzesResponse[] },
      { course_id: number }
    >({
      query: ({ course_id }) => ({
        url: `/quiz?course_id=${course_id}`,
      }),
      providesTags: ["Quiz"],
    }),

    getSingleQuiz: builder.query<SingleQuizResponse, number>({
      query: (quizId) => `/quiz/${quizId}`,
      providesTags: ["Quiz"],
    }),

    getQuizResult: builder.query<QuizResultResponse, number>({
      query: (quizId) => `/quiz/result/${quizId}`,
      providesTags: ["Quiz"],
    }),

    getUserQuizResult: builder.query<
      QuizResultResponse,
      { quizId: number; userId: number }
    >({
      query: ({ quizId, userId }) => `/quiz/result/${quizId}/${userId}`,
      providesTags: ["Quiz"],
    }),

    addQuiz: builder.mutation<{ data: QuizzesResponse }, CreateQuiz>({
      query: (values) => ({
        url: `/quiz`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Quiz"],
    }),

    createAssessment: builder.mutation<
      { data: AssessmentResponse },
      { name: string; quiz_id: number }
    >({
      query: (values) => ({
        url: `/assessment`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Quiz"],
    }),

    createQuestionFromFile: builder.mutation<
      { data: FileUploadQuestionResponse },
      { file_url: string; assessment_id: number }
    >({
      query: (values) => ({
        url: `/question/bulk/file`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Quiz"],
    }),

    createQuestionManually: builder.mutation<
      { data: ManualUploadQuestionResponse },
      ManualUploadQuestion
    >({
      query: (values) => ({
        url: `/question/bulk`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Quiz"],
    }),

    shareQuiz: builder.mutation<{ message: string }, shareQuizInput>({
      query: (body) => ({
        url: `/quiz/publish`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Quiz"],
    }),
    deleteQuiz: builder.mutation<{ message: string }, number>({
      query: (quiz_id) => ({
        url: `/quiz/${quiz_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetCourseQuizzesQuery,
  useGetSingleQuizQuery,
  useGetQuizResultQuery,
  useGetUserQuizResultQuery,
  useAddQuizMutation,
  useCreateAssessmentMutation,
  useCreateQuestionFromFileMutation,
  useCreateQuestionManuallyMutation,
  useShareQuizMutation,
  useDeleteQuizMutation,
} = quizzesApi;
