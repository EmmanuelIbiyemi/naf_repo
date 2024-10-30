export type Fee = {
  id?: number;
  name: string;
  fee: number;
  level_id: number;
  faculty: string;
  Department: string;
  level: string;
};

export type FeeCreateType = Fee & {};

export type FeeFormAction = (fee: Fee) => Promise<void>;

export type FeeResponse = {
  data: Fee[];
};
