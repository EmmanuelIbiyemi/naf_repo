export type MediaCreateType = { id: number; caption?: string };
export type MediaType = {
  id: number;
  created_at?: string;
  name: string;
  type: string;
  updated_at?: string;
  url: string;
  caption?: string;
};

export type BlockSettings = {
  backgroundColor?: string;
  contentWidth?: "narrow" | "default" | "wide" | "full";
  layout?: "stack" | "row";
  paddingBottom?: number;
  paddingTop?: number;
  borderRadius?: number;
  rowId?: string;
  columnWidth?: "1/2" | "1/3" | "2/3" | "1/4" | "3/4";
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  containerStyle?: "normal" | "card";
  postsToShow?: number;
  resultSearch?: ResultSearchSettings;
  // Grid settings
  gridColumns?: 1 | 2;
  columnIndex?: number; // Which column this block belongs to within its parent grid
};

export type GridColumn = {
  blocks: BlockType[];
  settings?: {
    containerStyle?: "normal" | "card";
  };
};

export type ResultSearchScope = {
  department_id: number;
  level_id: number;
  semester: string;
  session: string;
  department_name?: string;
  level_name?: string;
  count?: number;
};

export type ResultSearchSettings = {
  scopes?: ResultSearchScope[];
  responseStyle?: "simple" | "detailed";
  showFields?: {
    session?: boolean;
    summary?: boolean;
    participant?: boolean;
  };
  participantFields?: {
    name?: boolean;
    email?: boolean;
    matricNumber?: boolean;
    photo?: boolean;
    courseInfo?: boolean;
  };
  summaryFields?: {
    cumulative_grade_point_average?: boolean;
    cumulative_total_credit_units?: boolean;
    cumulative_total_grade_points?: boolean;
    grade_point_average?: boolean;
    total_credit_units?: boolean;
    total_grade_points?: boolean;
  };
  inputLabel?: string;
  inputPlaceholder?: string;
  buttonLabel?: string;
  emptyMessage?: string;
  session?: string;
  semester?: string;
  sessionId?: number;
  semesterId?: number;
};

export type BlockType = {
  caption: string;
  content: string;
  id: number;
  randomId: string | null | undefined;
  link: string;
  media: MediaCreateType[] | MediaType[] | null;
  position: number;
  settings?: BlockSettings;
  title: string;
  type: string;
  description?: string;
  // For grid blocks: contains columns with nested blocks
  columns?: GridColumn[];
};
