import { ParticipantData } from "../../types/participants";
import { appApi } from "./app.api";

// Response interfaces
interface BaseResponse {
  status: string;
  message: string;
}

interface ParticipantResponse extends BaseResponse {
  data: ParticipantData;
}

interface ParticipantsResponse extends BaseResponse {
  data: ParticipantData[];
}

// Request interfaces
interface CreateParticipantRequest {
  photo: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}

interface UpdateParticipantRequest extends Partial<CreateParticipantRequest> {
  participant_id?: number;
}

interface AddCourseRequest {
  course_id: number;
  participant_id?: number;
}

interface AddDropCoursesRequest {
  course_ids: number[];
  participant_id?: number; // Optional, not needed when user is a participant
}

interface DropCourseRequest {
  participant_id?: number;
}

const participantsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all participants
    getParticipants: builder.query<ParticipantsResponse, void>({
      query: () => ({
        url: "/participant",
        method: "GET",
      }),
      providesTags: ["Participants"],
    }),

    // GET single participant
    getParticipant: builder.query<ParticipantResponse, number>({
      query: (id) => ({
        url: `/participant/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Participants", id }],
    }),

    // POST create participant
    createParticipant: builder.mutation<
      ParticipantResponse,
      CreateParticipantRequest
    >({
      query: (body) => ({
        url: "/participant",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Participants"],
    }),

    // PUT update participant
    updateParticipant: builder.mutation<
      ParticipantResponse,
      { id: number; data: UpdateParticipantRequest }
    >({
      query: ({ id, data }) => ({
        url: `/participant/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Participants",
        { type: "Participants", id },
      ],
    }),

    // DELETE participant
    deleteParticipant: builder.mutation<BaseResponse, number>({
      query: (id) => ({
        url: `/participant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Participants"],
    }),

    // GET course participants
    getCourseParticipants: builder.query<
      { data: ParticipantData[] },
      { course_id: number | null }
    >({
      query: ({ course_id }) => `/participant/course/${course_id}`,
      providesTags: ["Participants"],
    }),

    // POST add single course
    addCourse: builder.mutation<ParticipantResponse, AddCourseRequest>({
      query: (body) => ({
        url: "/participant/course",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Participants", "Courses"],
    }),

    addCourses: builder.mutation<ParticipantResponse, AddDropCoursesRequest>({
      query: (body) => ({
        url: "/participant/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Participants", "Courses"],
    }),

    // Drop multiple courses
    dropCourses: builder.mutation<BaseResponse, AddDropCoursesRequest>({
      query: (body) => ({
        url: "/participant/courses",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Participants", "Courses"],
    }),

    // DELETE drop single course
    dropCourse: builder.mutation<
      BaseResponse,
      { courseId: number; data: DropCourseRequest }
    >({
      query: ({ courseId, data }) => ({
        url: `/participant/course/${courseId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Participants", "Courses"],
    }),
  }),
});

// Export hooks
export const {
  useGetParticipantsQuery,
  useGetParticipantQuery,
  useCreateParticipantMutation,
  useUpdateParticipantMutation,
  useDeleteParticipantMutation,
  useGetCourseParticipantsQuery,
  useAddCourseMutation,
  useAddCoursesMutation,
  useDropCourseMutation,
  useDropCoursesMutation,
} = participantsApi;

// Export API slice
export default participantsApi;
