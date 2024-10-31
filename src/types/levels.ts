export type LevelType = {
  id?: number;
  name: string;
  program_id: number;
};

export type LevelCreateType = LevelType & {};
export type LevelCourseCreateType = {
  level_id: number;
  course_ids: number[];
  type: string;
};

export type LevelsResponse = {
  data: LevelType[];
};

export type LevelFormAction = (level: LevelType) => Promise<void>;
