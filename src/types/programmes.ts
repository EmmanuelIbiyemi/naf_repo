export type Programme = {
  id?: number;
  name: string;
  department_id: number;
};

export type ProgrammeResponse = {
  data: Programme[];
};

export type ProgrammeFormAction = (programme: Programme) => Promise<void>;
