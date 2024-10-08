type InstructorBase = {
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  updated_at: string;
};

export type InstructorType = InstructorBase & { id?: number };
export type InstructorCreateType = InstructorBase & { password: string };

export type InstructorsResponse = { data: InstructorType[] };

export type InstructorCombinedType = InstructorCreateType | InstructorType;
export type InstructorEditFuncType = (student: InstructorCombinedType) => void;
