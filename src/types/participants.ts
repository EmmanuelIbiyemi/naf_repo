import { CoursesResponse } from "./courses";

interface Participants {
  id: number;
}

export type ParticipantData = {
  address: string;
  courses: CoursesResponse;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  level: string;
  matric_number: string;
  phone: string;
  photo: string;
  signature: string;
  updated_at: string;
  user_id: number;
};

export type Participant = Participants[];
