import {
  Box,
  Button,
  Divider,
  Drawer,
  SxProps,
  Typography,
} from "@mui/material";
import { Mail } from "@mui/icons-material";
import formStyles from "../../../../components/form/form.module.scss";
import { Lecturer } from "../../../../types/lecturers";

type Props = {
  lecturer: Lecturer | undefined;
  toggleDrawer: () => void;
};

const LecturerSidebar = ({ lecturer, toggleDrawer }: Props) => {
  return (
    <Drawer open={Boolean(lecturer)} onClose={toggleDrawer} anchor="right">
      <Box sx={sideBarStyles}>
        <Box>
          <Typography variant="h5">Preview Infomation</Typography>
        </Box>
        <Divider sx={{ marginBottom: "1.5rem", marginTop: "1rem" }} />
        <Box sx={{ alignItems: "center", display: "flex", gap: "1rem" }}>
          <Box
            sx={{
              position: "relative",
              height: "100px",
              width: "100px",
              img: {
                position: "absolute",
                objectFit: "cover",
                width: "100%",
                height: "100%",
              },
            }}
          >
            <img src={lecturer?.photo} alt="" />
          </Box>
          <Box>
            <Typography variant="h6">
              {lecturer?.first_name} {lecturer?.last_name}
            </Typography>
            <Typography
              sx={{ alignItems: "center", display: "flex", gap: ".5rem" }}
            >
              <Mail
                sx={{ color: "rgba(179, 179, 179, 1)", fontSize: "1.2rem" }}
              />{" "}
              {lecturer?.email}
            </Typography>
          </Box>
        </Box>
        <Box sx={infoSectionStyles}>
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            Personal Information
          </Typography>
          <Typography>
            <span>First Name</span>
            <span>{lecturer?.first_name}</span>
          </Typography>
          <Typography>
            <span>Last Name</span>
            <span>{lecturer?.last_name}</span>
          </Typography>
          <Typography>
            <span>Email</span>
            <span>{lecturer?.email}</span>
          </Typography>
          <Typography>
            <span>Phone Number</span>
            <span>{lecturer?.phone}</span>
          </Typography>
          <Typography>
            <span>Address</span>
            <span>{lecturer?.address}</span>
          </Typography>
        </Box>
        <Box className={formStyles.btn_group} sx={{ marginTop: "2rem" }}>
          <Button
            onClick={toggleDrawer}
            className={formStyles.cancel_btn}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default LecturerSidebar;

const sideBarStyles: SxProps = {
  height: "100%",
  padding: "1.5rem",
  width: "35vw",

  p: {
    margin: 0,
  },
};

const infoSectionStyles: SxProps = {
  marginTop: "2rem",
  ".MuiTypography-root": {
    display: "flex",
    justifyContent: "space-between",
    padding: ".4rem 1rem",
    gap: "1rem",

    "span:nth-child(2)": {
      textAlign: "right",
    },
  },
};
