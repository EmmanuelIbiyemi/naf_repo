type InstructorBase = {
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
};

export type InstructorType = InstructorBase & {
  id?: number;
  updated_at: string;
};
export type InstructorCreateType = InstructorBase & {};

export type InstructorsResponse = { data: InstructorType[] };

export type InstructorCombinedType = InstructorCreateType | InstructorType;
export type InstructorEditFuncType = (student: InstructorCombinedType) => void;
