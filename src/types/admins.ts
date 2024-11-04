export type Admin = {
  id?: number;
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  updated_at: string;
};

export type AdminCreateType = Admin & {};

export type AdminFormAction = (admin: Admin) => Promise<void>;

export type AdminResponse = {
  data: Admin[];
};
