import { LevelType } from "./levels";
import { Programme } from "./programmes";

export type EligibleCreateType = {
  session: string;
  program_id: number;
  level_id: number;
  list_url: string;
};

export type EligibleType = {
  id: number;
  created_at: string;
  level: LevelType;
  program: Programme;
  reg_number: string;
  session: string;
  updated_at: string;
};

export type EligiblesResponse = { data: EligibleType[] };
