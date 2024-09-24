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
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";

const PropertiesSideBar = () => {
  const [props, setProps] = useState({
    fontFamily: 1,
    fontSize: 11,
    bold: false,
    italic: false,
    underline: false,
  });

  const handleChange = (event: SelectChangeEvent<number>, child: ReactNode) => {
    console.log(event.target.value);
    console.log(child);
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

  return (
    <Box sx={propertiesSidebarStyles}>
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
            <Button>
              <FormatBold />
            </Button>
            <Button>
              <FormatItalic />
            </Button>
            <Button>
              <FormatUnderlined />
            </Button>
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
                height: "30px",
                width: "30px",
              }}
            />
          </Button>
        </Box>
        <Box sx={{ ...groupStyles, marginTop: "1rem" }}>
          <Button>
            <FormatAlignLeft />
          </Button>
          <Button>
            <FormatAlignCenter />
          </Button>
          <Button>
            <FormatAlignRight />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertiesSideBar;

const propertiesSidebarStyles: SxProps = {
  borderRight: "1px solid rgba(229, 229, 229, 1)",
  bgcolor: "rgba(249, 250, 251, 1)",
  overflow: "auto",
  height: "100vh",
  padding: "1rem var(--padding)",

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
