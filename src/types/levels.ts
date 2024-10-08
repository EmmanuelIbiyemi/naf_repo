type LevelBaseType = {
  name: string;
  program_id: number;
};
export type LevelType = LevelBaseType & {
  id?: number;
};

export type LevelCreateType = LevelBaseType & {};

export type LevelsResponse = {
  data: LevelType[];
};

export type LevelCourseCreateType = {
  level_id: number;
  course_ids: number[];
  type: string;
};
