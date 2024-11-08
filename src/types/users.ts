export type UserType = {
  id: number;
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  role: string;
  updated_at: string;
  courses?: string[];
};

export type UserLoginType = {
  email: string;
  password: string;
};
