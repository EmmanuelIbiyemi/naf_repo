type SettingsBase = {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  title: string;
  password: string;
};
export type SettingsCreateType = SettingsBase;

export type SettingsType = SettingsBase & {
  id: number;
  image: unknown;
};

export type SettingsCombinedType = SettingsCreateType | SettingsType;
export type SettingsEditFuncType = (student: SettingsCombinedType) => void;
