import {
  ActivityLogFilters,
  ActivityLogFilterOptionsResponse,
  ActivityLogResponse,
} from "../../types/activitylog";
import { appApi } from "./app.api";

const activityLogApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all activity logs (admin sees all, others see their own)
    getActivityLogs: builder.query<ActivityLogResponse, ActivityLogFilters>({
      query: ({
        page = 1,
        per_page = 20,
        search_term,
        role,
        user_id,
        action_type,
        resource_type,
        start_date,
        end_date,
      }) => {
        let url = `/activity-log?page=${page}&per_page=${per_page}`;
        if (search_term) url += `&search_term=${encodeURIComponent(search_term)}`;
        if (role) url += `&role=${encodeURIComponent(role)}`;
        if (user_id) url += `&user_id=${user_id}`;
        if (action_type) url += `&action_type=${encodeURIComponent(action_type)}`;
        if (resource_type) url += `&resource_type=${encodeURIComponent(resource_type)}`;
        if (start_date) url += `&start_date=${encodeURIComponent(start_date)}`;
        if (end_date) url += `&end_date=${encodeURIComponent(end_date)}`;
        return url;
      },
      providesTags: ["ActivityLogs"],
    }),

    // Get current user's activity logs
    getMyActivityLogs: builder.query<ActivityLogResponse, ActivityLogFilters>({
      query: ({
        page = 1,
        per_page = 20,
        search_term,
        action_type,
        resource_type,
        start_date,
        end_date,
      }) => {
        let url = `/activity-log/my?page=${page}&per_page=${per_page}`;
        if (search_term) url += `&search_term=${encodeURIComponent(search_term)}`;
        if (action_type) url += `&action_type=${encodeURIComponent(action_type)}`;
        if (resource_type) url += `&resource_type=${encodeURIComponent(resource_type)}`;
        if (start_date) url += `&start_date=${encodeURIComponent(start_date)}`;
        if (end_date) url += `&end_date=${encodeURIComponent(end_date)}`;
        return url;
      },
      providesTags: ["ActivityLogs"],
    }),

    // Get filter options (admin only)
    getActivityLogFilters: builder.query<ActivityLogFilterOptionsResponse, void>({
      query: () => `/activity-log/filters`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetActivityLogsQuery,
  useGetMyActivityLogsQuery,
  useGetActivityLogFiltersQuery,
} = activityLogApi;
