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
import { StudentType } from "../../../../types/students";

type Props = {
  open: boolean;
  student: StudentType | undefined;
  toggleDrawer: () => void;
};

const StudentSidebar = ({ open, student, toggleDrawer }: Props) => {
  return (
    <Drawer open={open} onClose={toggleDrawer} anchor="right">
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
            <img src={student?.photo} alt="" />
          </Box>
          <Box>
            <Typography variant="h6">
              {student?.first_name} {student?.last_name}
            </Typography>
            <Typography
              sx={{ alignItems: "center", display: "flex", gap: ".5rem" }}
            >
              <Mail
                sx={{ color: "rgba(179, 179, 179, 1)", fontSize: "1.2rem" }}
              />{" "}
              {student?.email}
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
            <span>{student?.first_name}</span>
          </Typography>
          <Typography>
            <span>Last Name</span>
            <span>{student?.last_name}</span>
          </Typography>
          <Typography>
            <span>Email</span>
            <span>{student?.email}</span>
          </Typography>
          <Typography>
            <span>Phone Number</span>
            <span>{student?.phone}</span>
          </Typography>
          <Typography>
            <span>Address</span>
            <span>{student?.address}</span>
          </Typography>
        </Box>
        <Box sx={infoSectionStyles}>
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            Academics
          </Typography>
          <Typography>
            <span>Level</span>
            {student?.level?.name ? (
              <span>{student?.level?.name}</span>
            ) : (
              <span>No level found</span>
            )}
          </Typography>
          <Typography sx={{ textAlign: "end" }}>
            <span>Courses</span>
            {student?.courses.length ? (
              <span>{student?.courses.map((crs) => crs.name).join(", ")}</span>
            ) : (
              <span>No courses found</span>
            )}
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

export default StudentSidebar;

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

    "span:nth-of-type(2)": {
      textAlign: "right",
    },
  },
};
