export type Programme = {
  id?: number;
  name: string;
};

export type ProgrammeResponse = {
  data: Programme[];
};

export type ProgrammeFormAction = (programme: Programme) => Promise<void>;
