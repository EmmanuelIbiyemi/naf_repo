export type LevelCoordinator = {
  id?: number;
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  role: string;
  updated_at: string;
  department: string;
  faculty: string;
};

export type LevelCoordinatorCreateType = LevelCoordinator & {};

export type LevelCoordinatorFormAction = (levelCoordinator: LevelCoordinator) => Promise<void>;


export type LevelCoordinatorResponse = {
  data: LevelCoordinator[];
};



