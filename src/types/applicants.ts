type ApplicantBaseType = {
  data: {
    dob: string;
    email: string;
    first_name: string;
    gender: string;
    last_name: string;
    phone: string;
    reg_number: string;
  };
  payment_reference: string;
  program_id: string;
  session: string;
  status: string;
  user_id: number;
};

export type ApplicantCreateType = ApplicantBaseType & {};

export type ApplicantType = ApplicantBaseType & {
  id: number;
  created_at: string;
  updated_at: string;
};

export type ApplicantsResponse = { data: ApplicantType[] };

export type ApplicantStatusChangeType = {
  applicant_id: number;
  status: string;
};
