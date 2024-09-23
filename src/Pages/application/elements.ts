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
    image: headingIcon,
    action: () => console.log("Heading"),
    icon: "H",
    text: "Heading",
  },
  {
    image: textIcon,
    action: () => console.log("Paragraph"),
    icon: "P",
    text: "Paragraph",
  },
  {
    image: textfieldIcon,
    action: () => console.log("Text Field"),
    icon: "T",
    text: "Text Field",
  },
  {
    image: longTextIcon,
    action: () => console.log("Long Text"),
    icon: "L",
    text: "Long Text",
  },
  {
    image: userIcon,
    action: () => console.log("Full Name"),
    icon: "U",
    text: "Full Name",
  },
  {
    image: uploadIcon,
    action: () => console.log("Upload Document(s)"),
    icon: "U",
    text: "Upload Document(s)",
  },
  {
    image: imageIcon,
    action: () => console.log("Insert Image(s)"),
    icon: "I",
    text: "Insert Image(s)",
  },
  {
    image: emailIcon,
    action: () => console.log("Email"),
    icon: "E",
    text: "Email",
  },
  {
    image: phoneIcon,
    action: () => console.log("Phone"),
    icon: "P",
    text: "Phone",
  },
  {
    image: datePickerIcon,
    action: () => console.log("Date Picker"),
    icon: "D",
    text: "Date Picker",
  },
  {
    image: atIcon,
    action: () => console.log("Signature"),
    icon: "S",
    text: "Signature",
  },
  {
    image: dropdownIcon,
    action: () => console.log("Dropdown"),
    icon: "D",
    text: "Dropdown",
  },
  {
    image: singleChoiceIcon,
    action: () => console.log("Single Choice"),
    icon: "S",
    text: "Single Choice",
  },
  {
    image: multiChoiceIcon,
    action: () => console.log("Multi Choice"),
    icon: "M",
    text: "Multi Choice",
  },
];
