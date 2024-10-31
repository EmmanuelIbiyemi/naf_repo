export interface Meeting {
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
    // Add specific settings as needed
    [key: string]: any;
  };
  start_time: string;
  start_url: string;
  status: string;
  timezone: string;
  topic: string;
  type: number;
  uuid: string;
}

export interface LiveClass {
  id?: number;
  course_id: string;
  session: string;
  semester: string;
  start_time: string;
  duration: number;
  topic: string;
  meeting?: Meeting;
  created_at?: string;
  updated_at?: string;
}

export interface LiveClassResponse {
  status: string;
  message: string;
  data: LiveClass[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
}

export interface SingleLiveClassResponse {
  status: string;
  message: string;
  data: LiveClass;
}
