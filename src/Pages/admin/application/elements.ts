import headingIcon from "../../../assets/heading.svg";
import textIcon from "../../../assets/paragraph.svg";
import textfieldIcon from "../../../assets/textfield.svg";
import datePickerIcon from "../../../assets/datepicker.svg";
import userIcon from "../../../assets/user.svg";
import imageIcon from "../../../assets/image.svg";
import singleChoiceIcon from "../../../assets/singlechoice.svg";

export const formElements = [
  {
    id: 1,
    image: headingIcon,
    type: "heading",
    name: "Heading",
    key: "heading",
    options: null,
  },
  {
    id: 2,
    image: textIcon,
    type: "paragraph",
    name: "Paragraph",
    key: "paragraph",
    options: null,
  },

  {
    id: 3,
    image: userIcon,
    type: "full-name",
    name: "Full Name",
    key: "full_name",
    options: null,
  },
  {
    id: 4,
    image: textfieldIcon,
    type: "text-field",
    name: "Email",
    key: "email",
    options: null,
  },
  {
    id: 5,
    image: textfieldIcon,
    type: "text-field",
    name: "Phone Number",
    key: "phone_number",
    options: null,
  },
  {
    id: 6,
    image: textfieldIcon,
    type: "text-field",
    name: "Home Address",
    key: "home_address",
    options: null,
  },
  {
    id: 7,
    image: singleChoiceIcon,
    type: "single-choice",
    name: "Gender",
    key: "gender",
    options: ["Male", "Female"],
  },
  {
    id: 7,
    image: singleChoiceIcon,
    type: "single-choice",
    name: "Marital Status",
    key: "marital_status",
    options: ["Single", "Married", "Other"],
  },
  {
    id: 8,
    image: datePickerIcon,
    type: "date-picker",
    name: "DOB",
    key: "dob",
    options: null,
  },
  {
    id: 9,
    image: imageIcon,
    type: "images",
    name: "Headshot",
    key: "headshot",
    options: null,
  },
];
