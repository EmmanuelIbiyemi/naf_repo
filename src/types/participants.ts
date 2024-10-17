export type Participant = {
  id?: number;
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  role: string;
  updated_at: string;
  department: string;
  faculty: string;
};

export type ParticipantCreateType = Participant & {};

export type ParticipantFormAction = (participant: Participant) => Promise<void>;

export type ParticipantResponse = {
  data: Participant[];
};
