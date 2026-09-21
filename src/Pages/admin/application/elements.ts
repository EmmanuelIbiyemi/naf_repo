import {
  TextFields,
  VerifiedUser,
  SupervisedUserCircle,
} from "@mui/icons-material";

export const formElements = [
  {
    id: 1,
    icon: VerifiedUser,
    type: "text",
    name: "Reg. Number",
    key: "reg_number",
    placeholder: "Enter your registration number",
  },
  {
    id: 2,
    icon: SupervisedUserCircle,
    type: "text",
    name: "First Name",
    key: "first_name",
    placeholder: "Enter your first name",
  },

  {
    id: 3,
    icon: SupervisedUserCircle,
    type: "text",
    name: "Last Name",
    key: "last_name",
    placeholder: "Enter your last name",
  },
  {
    id: 4,
    icon: TextFields,
    type: "text",
    name: "Email",
    key: "email",
    placeholder: "Enter your email",
  },
  {
    id: 5,
    icon: TextFields,
    type: "",
    name: "Custom Field",
    key: "",
    placeholder: "",
  },
  ];
