import { useGetAppSettingsQuery } from "../store/api/appSettings.api";

/**
 * Custom hook to get app settings with environment variable fallbacks
 * Returns settings from API if available, otherwise falls back to env variables
 */
export const useAppConfig = () => {
  const { data: settings, isLoading, error } = useGetAppSettingsQuery();

  return {
    isLoading,
    error,
    config: {
      logo: settings?.logo_url || import.meta.env.VITE_LOGO || "",
      schoolNameInHeader: settings?.school_name_in_header || import.meta.env.VITE_SCHOOL_NAME_IN_HEADER || "",
      schoolName: settings?.school_name || import.meta.env.VITE_SCHOOL_NAME || "",
      schoolAcronym: settings?.school_acronym || import.meta.env.VITE_SCHOOL_ACRONYM || "",
      schoolDescription: settings?.school_description || import.meta.env.VITE_SCHOOL_DESCRIPTION || "",
      schoolKeywords: settings?.school_keywords || import.meta.env.VITE_SCHOOL_KEYWORDS || "",
      email: settings?.email || import.meta.env.VITE_EMAIL || "",
      phoneNumber: settings?.phone_number || import.meta.env.VITE_PHONE_NUMBER || "",
      xUrl: settings?.x_url || import.meta.env.VITE_X || "",
      facebookUrl: settings?.facebook_url || import.meta.env.VITE_FACEBOOK || "",
      youtubeUrl: settings?.youtube_url || import.meta.env.VITE_YOUTUBE || "",
    },
  };
};
