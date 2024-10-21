import headingIcon from "../../../assets/heading.svg";
import textIcon from "../../../assets/paragraph.svg";
import textfieldIcon from "../../../assets/textfield.svg";
import userIcon from "../../../assets/user.svg";
import uploadIcon from "../../../assets/upload.svg";
import imageIcon from "../../../assets/image.svg";
import datePickerIcon from "../../../assets/datepicker.svg";
import dropdownIcon from "../../../assets/dropdown.svg";
import singleChoiceIcon from "../../../assets/singlechoice.svg";
import multiChoiceIcon from "../../../assets/multichoice.svg";

export const formElements = [
  {
    id: 1,
    image: headingIcon,
    type: "heading",
    icon: "H",
    text: "Heading",
    content: "Type something here",
  },
  {
    id: 2,
    image: textIcon,
    type: "paragraph",
    icon: "P",
    text: "Paragraph",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: 3,
    image: textfieldIcon,
    type: "text-field",
    icon: "T",
    text: "Text Field",
    content: "Label",
  },
  {
    id: 4,
    image: textfieldIcon,
    type: "textarea",
    icon: "T",
    text: "Text Area",
    content: "Label",
  },
  {
    id: 5,
    image: userIcon,
    type: "full-name",
    icon: "U",
    text: "Full Name",
    content: "Label",
  },
  {
    id: 6,
    image: uploadIcon,
    type: "documents",
    icon: "U",
    text: "Upload Document(s)",
    content: "Label",
  },
  {
    id: 7,
    image: imageIcon,
    type: "images",
    icon: "I",
    text: "Insert Image(s)",
    content: "Label",
  },
  {
    id: 8,
    image: datePickerIcon,
    type: "date-picker",
    icon: "D",
    text: "Date Picker",
    content: "Label",
  },
  {
    id: 9,
    image: dropdownIcon,
    type: "dropdown",
    icon: "D",
    text: "Dropdown",
    content: "Label",
  },
  {
    id: 10,
    image: singleChoiceIcon,
    type: "single-choice",
    icon: "S",
    text: "Single Choice",
    content: "Label",
  },
  {
    id: 11,
    image: multiChoiceIcon,
    type: "multi-choice",
    icon: "M",
    text: "Multi Choice",
    content: "Label",
  },
];
