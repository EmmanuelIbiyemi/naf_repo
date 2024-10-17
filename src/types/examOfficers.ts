export type ExamOfficer = {
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

export type ExamOfficerCreateType = ExamOfficer & {};

export type ExamOfficerFormAction = (examOfficer: ExamOfficer) => Promise<void>;


export type ExamOfficerResponse = {
  data: ExamOfficer[];
};



