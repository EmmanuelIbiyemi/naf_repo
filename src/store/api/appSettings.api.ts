import { appApi } from "./app.api";

export interface AppSettings {
  email?: string;
  phone_number?: string;
  x_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  logo_url?: string;
  school_name_in_header?: string;
  school_name?: string;
  school_acronym?: string;
  school_description?: string;
  school_keywords?: string;
  [key: string]: string | undefined;
}

export interface SettingItem {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

const appSettingsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppSettings: builder.query<AppSettings, void>({
      query: () => "/settings",
      providesTags: ["AppSettings"],
    }),
    getAdminSettings: builder.query<SettingItem[], void>({
      query: () => "/admin/settings",
      providesTags: ["AppSettings"],
    }),
    updateSetting: builder.mutation<SettingItem, { key: string; value: string }>({
      query: ({ key, value }) => ({
        url: `/admin/settings/${key}`,
        method: "PUT",
        body: { value },
      }),
      invalidatesTags: ["AppSettings"],
    }),
    bulkUpdateSettings: builder.mutation<{ message: string }, { settings: Array<{ key: string; value: string }> }>({
      query: (body) => ({
        url: "/admin/settings/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AppSettings"],
    }),
  }),
});

export const {
  useGetAppSettingsQuery,
  useGetAdminSettingsQuery,
  useUpdateSettingMutation,
  useBulkUpdateSettingsMutation,
} = appSettingsApi;
