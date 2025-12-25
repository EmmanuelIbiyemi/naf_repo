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

export type LegacyResultCourseInput = {
  course_code: string;
  course_name?: string;
  course_credit_unit: number | string;
  total_obtainable_score: number | string;
  total_obtained_score: number | string;
  score_name?: string;
  score_remark?: string;
  grade_point?: number | string;
  quality_point?: number | string;
};

export type LegacyResultCreateType = {
  participant_id: number;
  session: string;
  semester: string;
  department_id: number;
  level_id: number;
  details: LegacyResultCourseInput[];
  summary?: {
    total_grade_points?: number;
    total_credit_units?: number;
    grade_point_average?: number;
    cumulative_grade_point_average?: number;
  };
};

export type LegacyResultResponse = {
  data: StudentResultResponse["data"];
  message: string;
  status: string;
};

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

export interface ResultTaskResponse {
  task_id: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  message: string;
  created_at: string;
  updated_at?: string;
}

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
