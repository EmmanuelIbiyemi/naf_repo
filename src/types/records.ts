export interface recordResponse {
  created_at: string;
  id: number;
  name: string;
  obtainable_score: number;
  scores: scoresResponse[];
  semester: string;
  session: string;
  updated_at: string;
}

export interface recordInput {
  name: string;
  session: string;
  semester: string;
  obtainable_score: number;
  course_id: number;
}

export interface updateRecordInput {
  name: string;
  obtainable_score: number;
}

export interface scoresResponse {
  created_at: string;
  id: number;
  obtained_score: number;
  participant: {
    address: string;
    created_at: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    matric_number: string;
    phone: string;
    photo: string;
    signature: null;
    updated_at: string;
    user_id: number;
  };
  updated_at: string;
}

export interface scoresInput {
  obtained_score: number;
  participant_id: number;
}

export interface bulkScoresInput {
  scores: scoresInput[];
  record_id: number;
}
