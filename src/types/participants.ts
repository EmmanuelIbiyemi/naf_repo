type ParticipantBase = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  courses: string;
  password: string;
};
export type ParticipantCreateType = ParticipantBase & {
  courses: string;
};

export type ParticipantType = ParticipantBase & {
  id: number;
};

export type ParticipantCombinedType = ParticipantCreateType | ParticipantType;
export type ParticipantEditFuncType = (
  participant: ParticipantCombinedType
) => void;
