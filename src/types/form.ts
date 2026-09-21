import { SvgIconComponent } from "@mui/icons-material";

export type FormElement = {
  id: number;
  icon: SvgIconComponent;
  type: string;
  name: string;
  key: string;
  placeholder: string;
};