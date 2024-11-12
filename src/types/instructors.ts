type InstructorBase = {
  id?: number;
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  signature?: string;
};

export type updateInstructor = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  photo: string;
};

export type InstructorType = InstructorBase & {
  updated_at: string;
};
export type InstructorCreateType = InstructorBase & {};

export type InstructorsResponse = { data: InstructorType[] };
export type instructorSingleResponse = { data: InstructorType };

export type InstructorCombinedType = InstructorCreateType | InstructorType;
export type InstructorEditFuncType = (student: InstructorCombinedType) => void;
