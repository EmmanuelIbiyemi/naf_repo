import { CourseBaseType } from "./courses";

interface Participants {
  id: number;
}

export type ParticipantData = {
  id: number;
  address: string;
  courses?: CourseBaseType[];
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  level?: {
    name: string;
    program: {
      name: string;
      department: {
        name: string;
      };
    };
  };
  matric_number: string;
  phone: string;
  photo: string;
  signature: string;
  updated_at: string;
  user_id: number;
};

export type ParticipantsMultipleData = ParticipantData[];
export type Participant = Participants[];
