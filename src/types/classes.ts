export interface LiveClassesResponse {
  created_at: string;
  duration: number;
  id: number;
  meeting: {
    agenda: string;
    created_at: string;
    duration: number;
    encrypted_password: string;
    h323_password: string;
    host_email: string;
    host_id: string;
    id: number;
    join_url: string;
    password: string;
    pre_schedule: boolean;
    pstn_password: string;
    settings: {
      allow_multiple_devices: boolean;
      alternative_host_update_polls: boolean;
      alternative_hosts: string;
      alternative_hosts_email_notification: boolean;
      approval_type: number;
      approved_or_denied_countries_or_regions: {
        enable: boolean;
      };
      audio: string;
      auto_recording: string;
      breakout_room: {
        enable: boolean;
      };
      close_registration: boolean;
      cn_meeting: boolean;
      continuous_meeting_chat: {
        auto_add_invited_external_users: boolean;
        auto_add_meeting_participants: boolean;
        channel_id: string;
        enable: boolean;
      };
      device_testing: boolean;
      email_in_attendee_report: boolean;
      email_notification: boolean;
      enable_dedicated_group_chat: boolean;
      encryption_type: string;
      enforce_login: boolean;
      enforce_login_domains: string;
      focus_mode: boolean;
      host_save_video_order: boolean;
      host_video: boolean;
      in_meeting: boolean;
      internal_meeting: boolean;
      jbh_time: number;
      join_before_host: boolean;
      meeting_authentication: boolean;
      meeting_invitees: [];
      mute_upon_entry: boolean;
      participant_focused_meeting: boolean;
      participant_video: boolean;
      private_meeting: boolean;
      push_change_to_calendar: boolean;
      registrants_confirmation_email: boolean;
      registrants_email_notification: boolean;
      request_permission_to_unmute_participants: boolean;
      resources: [];
      show_join_info: boolean;
      show_share_button: boolean;
      sign_language_interpretation: {
        enable: boolean;
      };
      use_pmi: boolean;
      waiting_room: boolean;
      watermark: boolean;
    };
    start_time: string;
    start_url: string;
    status: string;
    timezone: string;
    topic: string;
    type: number;
    uuid: string;
  };
  semester: string;
  session: string;
  start_time: string;
  topic: string;
  updated_at: string;
}

export interface CreateLiveClass {
  course_id: number;
  session: string | undefined;
  semester: string | undefined;
  start_time: string;
  duration: number;
  topic: string;
}
