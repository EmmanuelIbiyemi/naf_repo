export interface StudentResultResponse {
  data: {
    created_at: string;
    department: {
      created_at: string;
      id: number;
      name: string;
      programs: {
        created_at: string;
        department_id: number;
        id: number;
        name: string;
        updated_at: string;
      }[];
      updated_at: string;
    };
    details: {
      course_code: string;
      course_credit_unit: number;
      course_name: string;
      grade_point: number;
      participant_id: number;
      quality_point: number;
      score_name: string;
      score_remark: string;
      total_obtainable_score: number;
      total_obtained_score: number;
    }[];
    id: number;
    level: {
      created_at: string;
      id: number;
      name: string;
      updated_at: string;
    };
    participant: {
      address: string | null;
      created_at: string;
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      matric_number: string;
      phone: string;
      photo: string | null;
      signature: string | null;
      updated_at: string;
      user_id: number;
    };
    semester: string;
    session: string;
    is_visible: boolean;
    visible_after: string | null;
    summary: {
      cumulative_grade_point_average: number;
      grade_point_average: number;
      total_credit_units: number;
      total_grade_points: number;
    };
    updated_at: string;
  };
  message: string;
  status: string;
}

export interface ResultCreateType {
  participant_id: number;
  session: string;
  semester: string;
  department_id: number;
  level_id: number;
  details: {
    course_code: string;
    course_credit_unit: number;
    total_obtainable_score: number;
    total_obtained_score: number;
  }[];
}

export type LegacyResultUploadPayload = {
  department_id: number;
  level_id: number;
  session: string;
  semester: string;
  file_url: string;
};

export type LegacyResultUploadResponse = {
  data: {
    uploaded: number;
    failed: number;
    failures: Array<{ row: number; matric_number?: string; reason: string }>;
  };
  message: string;
  status: string;
};

export interface ResultResponse {
  data: {
    id: number;
    created_at: string;
    updated_at: string;
    participant_id: number;
    session: string;
    semester: string;
    department: {
      id: number;
      name: string;
    };
    is_visible: boolean;
    visible_after: string | null;
    level: {
      id: number;
      name: string;
    };
    summary: {
      total_credit_units: number;
      total_grade_points: number;
      grade_point_average: number;
      cumulative_grade_point_average: number;
    };
  };
  message: string;
  status: string;
}

export type ResultTaskStartResponse = {
  data: { task_id: string };
  message: string;
  status: string;
};

export type ResultTaskStatus = {
  task_id: string;
  state: string;
  ready: boolean;
  successful: boolean;
  result?: unknown;
  error?: string | null;
};

export type ResultTaskStatusResponse = {
  data: ResultTaskStatus;
  message: string;
  status: string;
};

export interface TranscriptResponse {
  data: {
    participant_id: number;
    session: string;
    semester: string;
    courses: {
      course_code: string;
      course_name: string;
      credit_units: number;
      grade_point: number;
      score_name: string;
      score_remark: string;
    }[];
    cumulative_grade_point_average: number;
    total_credit_units: number;
    total_grade_points: number;
  };
  message: string;
  status: string;
}

export interface QuizResult {
  assessment_id: number;
  created_at: string;
  right: number;
  wrong: number;
}

export type QuizResults = QuizResult[];
export type Result = {
  id?: number;
  min_score: number;
  max_score: number;
  name: string;
  remark: string;
  program_id: number;
};

export type ResultsGetInput = {
  department_id: number;
  level_id: number;
  session?: string;
  semester?: string;
};
// export type ResultCreateType = Result & {};

// export type ResultResponse = {
//   data: Result[];
// };

export type ResultFormAction = (score: Result) => Promise<void>;

export type ResultType2 = {
  data: Array<{
    created_at: string;
    department: {
      created_at: string;
      id: number;
      name: string;
      programs: Array<{
        created_at: string;
        department_id: number;
        id: number;
        name: string;
        updated_at: string;
      }>;
      updated_at: string;
    };
    details: Array<{
      course_code: string;
      course_credit_unit: number;
      course_name: string;
      grade_point: number;
      participant_id: number;
      quality_point: number;
      score_name: string;
      score_remark: string;
      total_obtainable_score: number;
      total_obtained_score: number;
    }>;
    id: number;
    level: {
      created_at: string;
      id: number;
      name: string;
      program: {
        created_at: string;
        department: {
          created_at: string;
          id: number;
          name: string;
          updated_at: string;
        };
        department_id: number;
        id: number;
        name: string;
        updated_at: string;
      };
      updated_at: string;
    };
    participant: {
      address: string | null;
      created_at: string;
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      matric_number: string;
      phone: string;
      photo: string | null;
      signature: string | null;
      updated_at: string;
      user_id: number;
    };
    semester: string;
    session: string;
    is_visible: boolean;
    visible_after: string | null;
    summary: {
      cumulative_grade_point_average: number;
      grade_point_average: number;
      total_credit_units: number;
      total_grade_points: number;
    };
    updated_at: string;
  }>;
  message: string;
  status: string;
};

export type ResultVisibilityPayload = {
  department_id: number;
  level_id: number;
  session: string;
  semester: string;
  is_visible: boolean;
  visible_after?: string | null;
};

export type ResultVisibilityResponse = {
  data: { updated: number };
  message: string;
  status: string;
};

export type ResultDeletePayload = {
  department_id: number;
  level_id: number;
  session: string;
  semester: string;
};

export type ResultDeleteResponse = {
  data: { deleted: number };
  message: string;
  status: string;
};
