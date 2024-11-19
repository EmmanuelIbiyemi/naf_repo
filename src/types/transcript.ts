export interface StudentTranscriptResponse {
  data: ResultData[];
  message: string;
  status: string;
}

interface ResultData {
  created_at: string;
  department: Department;
  details: CourseDetail[];
  id: number;
  level: Level;
  participant: Participant;
  semester: string;
  session: string;
  summary: ResultSummary;
  updated_at: string;
}

interface Department {
  created_at: string;
  id: number;
  name: string;
  programs: Program[];
  updated_at: string;
}

interface Program {
  created_at: string;
  department_id: number;
  id: number;
  name: string;
  updated_at: string;
}

interface CourseDetail {
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
}

interface Level {
  created_at: string;
  id: number;
  name: string;
  program: Program & {
    department: Omit<Department, "programs">;
  };
  updated_at: string;
}

interface Participant {
  address: string | null;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  matric_number: string;
  phone: string;
  photo: string;
  signature: string | null;
  updated_at: string;
  user_id: number;
}

interface ResultSummary {
  cumulative_grade_point_average: number;
  grade_point_average: number;
  total_credit_units: number;
  total_grade_points: number;
}
