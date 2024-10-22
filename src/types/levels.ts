export type LevelType = {
  id?: number;
  name: string;
  program_id: number;
};

export type LevelCreateType = LevelType & {};

export type LevelsResponse = {
  data: LevelType[];
};

export type LevelFormAction = (level: LevelType) => Promise<void>;
