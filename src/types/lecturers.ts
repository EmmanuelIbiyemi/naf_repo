export type Lecturer = {
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

export type LecturerCreateType = Lecturer & {};

export type LecturerFormAction = (lecturer: Lecturer) => Promise<void>;


export type LecturerResponse = {
  data: Lecturer[];
};

