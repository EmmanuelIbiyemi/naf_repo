import headingIcon from "../../assets/heading.svg";
import textIcon from "../../assets/paragraph.svg";
import textfieldIcon from "../../assets/textfield.svg";
import longTextIcon from "../../assets/longtext.svg";
import userIcon from "../../assets/user.svg";
import uploadIcon from "../../assets/upload.svg";
import imageIcon from "../../assets/image.svg";
import emailIcon from "../../assets/email.svg";
import phoneIcon from "../../assets/phone.svg";
import datePickerIcon from "../../assets/datepicker.svg";
import atIcon from "../../assets/at.svg";
import dropdownIcon from "../../assets/dropdown.svg";
import singleChoiceIcon from "../../assets/singlechoice.svg";
import multiChoiceIcon from "../../assets/multichoice.svg";

export const formElements = [
  {
    id: 1,
    image: headingIcon,
    action: () => console.log("Heading"),
    icon: "H",
    text: "Heading",
  },
  {
    id: 2,
    image: textIcon,
    action: () => console.log("Paragraph"),
    icon: "P",
    text: "Paragraph",
  },
  {
    id: 3,
    image: textfieldIcon,
    action: () => console.log("Text Field"),
    icon: "T",
    text: "Text Field",
  },
  {
    id: 4,
    image: longTextIcon,
    action: () => console.log("Long Text"),
    icon: "L",
    text: "Long Text",
  },
  {
    id: 5,
    image: userIcon,
    action: () => console.log("Full Name"),
    icon: "U",
    text: "Full Name",
  },
  {
    id: 6,
    image: uploadIcon,
    action: () => console.log("Upload Document(s)"),
    icon: "U",
    text: "Upload Document(s)",
  },
  {
    id: 7,
    image: imageIcon,
    action: () => console.log("Insert Image(s)"),
    icon: "I",
    text: "Insert Image(s)",
  },
  {
    id: 8,
    image: emailIcon,
    action: () => console.log("Email"),
    icon: "E",
    text: "Email",
  },
  {
    id: 9,
    image: phoneIcon,
    action: () => console.log("Phone"),
    icon: "P",
    text: "Phone",
  },
  {
    id: 10,
    image: datePickerIcon,
    action: () => console.log("Date Picker"),
    icon: "D",
    text: "Date Picker",
  },
  {
    id: 11,
    image: atIcon,
    action: () => console.log("Signature"),
    icon: "S",
    text: "Signature",
  },
  {
    id: 12,
    image: dropdownIcon,
    action: () => console.log("Dropdown"),
    icon: "D",
    text: "Dropdown",
  },
  {
    id: 13,
    image: singleChoiceIcon,
    action: () => console.log("Single Choice"),
    icon: "S",
    text: "Single Choice",
  },
  {
    id: 14,
    image: multiChoiceIcon,
    action: () => console.log("Multi Choice"),
    icon: "M",
    text: "Multi Choice",
  },
];
