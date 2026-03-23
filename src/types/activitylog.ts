import { PaginationResponse } from "./pagination";

export type ActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "EXPORT"
  | "UPLOAD"
  | "DOWNLOAD"
  | "OTHER";

export type ActivityLog = {
  id: number;
  user_id: number | null;
  role: string | null;
  action_type: ActionType;
  resource_type: string | null;
  resource_id: number | null;
  description: string;
  ip_address: string | null;
  user_agent: string | null;
  extra_data: Record<string, unknown> | null;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
};

export type ActivityLogResponse = {
  data: ActivityLog[];
  pagination: PaginationResponse;
  message: string;
  status: string;
};

export type ActivityLogFilters = {
  page?: number;
  per_page?: number;
  search_term?: string;
  role?: string;
  user_id?: number;
  action_type?: ActionType;
  resource_type?: string;
  start_date?: string;
  end_date?: string;
};

export type ActivityLogFilterOptions = {
  action_types: ActionType[];
  resource_types: string[];
  roles: string[];
};

export type ActivityLogFilterOptionsResponse = {
  data: ActivityLogFilterOptions;
  message: string;
  status: string;
};
