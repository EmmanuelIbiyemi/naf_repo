import {
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatColorFill,
  FormatItalic,
  FormatUnderlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../store/hooks";
import { PostType } from "../../../../types/posts";
import { setCurrentAnnouncement } from "../../../../store/announcement.slice";

type Properties = {
  fontFamily: number;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignLeft: boolean;
  alignRight: boolean;
  alignCenter: boolean;
};

type Props = {
  post: PostType;
};

const PropertiesSideBar = ({ post }: Props) => {
  const navigate = useNavigate();
  const [props, setProps] = useState<Properties>({
    fontFamily: 1,
    fontSize: 11,
    bold: false,
    italic: false,
    underline: false,
    alignCenter: false,
    alignLeft: false,
    alignRight: false,
  });
  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent<number>) => {
    const {
      target: { name, value },
    } = event;

    setProps((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleBtnClick = (action: string) => {
    setProps((prev) => {
      return {
        ...prev,
        [action]: !prev[action as keyof Properties],
      };
    });
  };

  const handlePreviewPost = () => {
    dispatch(setCurrentAnnouncement(post));
    navigate("/instructor/posts/preview");
  };

  return (
    <Box sx={propertiesSidebarStyles}>
      <Box>
        <Typography variant="h5">Design</Typography>
        <Box>
          <Typography sx={{ marginBlock: "1rem" }}>Text</Typography>
          <Box sx={{ ...groupStyles, gap: "1rem" }}>
            <FormControl fullWidth sx={{ width: "70%" }}>
              <Select
                value={props.fontFamily}
                name="fontFamily"
                onChange={handleChange}
              >
                <MenuItem value={1}>Inter</MenuItem>
                <MenuItem value={2}>Roboto</MenuItem>
                <MenuItem value={3}>Helvatica</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ width: "30%" }}>
              <Select
                value={props.fontSize}
                name="fontSize"
                onChange={handleChange}
              >
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={13}>13</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ ...groupStyles, gap: "1rem", marginTop: "1rem" }}>
            <Box sx={groupStyles}>
              <CustomButton toggle={() => handleBtnClick("bold")}>
                <FormatBold />
              </CustomButton>
              <CustomButton toggle={() => handleBtnClick("italic")}>
                <FormatItalic />
              </CustomButton>
              <CustomButton toggle={() => handleBtnClick("underline")}>
                <FormatUnderlined />
              </CustomButton>
            </Box>

            <Button
              sx={{
                display: "flex",
                gap: ".5rem",
                justifyContent: "center",
                width: "80px !important",
              }}
            >
              <FormatColorFill />
              <span
                style={{
                  backgroundColor: "rgba(72, 156, 33, 1)",
                  borderRadius: "5px",
                  display: "inline-block",
                  height: "25px",
                  width: "25px",
                }}
              />
            </Button>
          </Box>
          <Box sx={{ ...groupStyles, marginTop: "1rem" }}>
            <CustomButton toggle={() => handleBtnClick("alignLeft")}>
              <FormatAlignLeft />
            </CustomButton>
            <CustomButton toggle={() => handleBtnClick("alignCenter")}>
              <FormatAlignCenter />
            </CustomButton>
            <CustomButton toggle={() => handleBtnClick("alignRight")}>
              <FormatAlignRight />
            </CustomButton>
          </Box>
        </Box>
      </Box>
      <Button variant="contained" onClick={() => handlePreviewPost()}>
        Preview & Share
      </Button>
    </Box>
  );
};

type BtnProps = {
  toggle: () => void;
} & PropsWithChildren &
  ButtonProps;

const CustomButton = ({ children, toggle, ...rest }: BtnProps) => {
  const [isActive, setIsActive] = useState(false);
  const handleChange = () => {
    setIsActive((prev) => !prev);
    toggle();
  };

  return (
    <Button
      {...rest}
      onClick={handleChange}
      sx={{ bgcolor: (isActive ? "#ddd" : "#fff") + "!important" }}
    >
      {children}
    </Button>
  );
};

export default PropertiesSideBar;

const propertiesSidebarStyles: SxProps = {
  alignContent: "space-between",
  borderLeft: "1px solid rgba(229, 229, 229, 1)",
  bgcolor: "rgba(249, 250, 251, 1)",
  display: "grid",
  height: "100vh",
  overflow: "auto",
  padding: "1rem var(--padding)",
  position: "sticky",
  top: 0,

  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const groupStyles: SxProps = {
  display: "flex",

  button: {
    bgcolor: "#fff",
    color: "inherit",
    height: "35px",
    minWidth: 0,
    padding: 0,
    width: "45px",
  },
  ".MuiSelect-select": {
    bgcolor: "#fff",
    paddingBlock: "8px",
  },
};
