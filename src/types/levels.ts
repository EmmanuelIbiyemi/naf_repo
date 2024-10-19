export type Level = {
  id?: number;
  name: string;
  program_id: number;
};

export type LevelCreateType = Level & {};

export type LevelResponse = {
  data: Level[];
};

export type LevelFormAction = (level: Level) => Promise<void>;
