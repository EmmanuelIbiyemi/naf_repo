import {
  Box,
  Button,
  Divider,
  Drawer,
  SxProps,
  Typography,
} from "@mui/material";
import { StudentType } from "../../types/students";
import participantImg from "/images/student.png";
import { Mail } from "@mui/icons-material";
import formStyles from "../../components/form/form.module.scss";
import { LoadingButton } from "@mui/lab";

type Props = {
  open: boolean;
  student: StudentType;
  toggleDrawer: (state: boolean) => void;
  openEditModal: () => void;
};

const StudentSidebar = ({
  open,
  student,
  toggleDrawer,
  openEditModal,
}: Props) => {
  return (
    <Drawer open={open} onClose={() => toggleDrawer(false)} anchor="right">
      <Box sx={sideBarStyles}>
        <Box>
          <Typography variant="h5">Preview Infomation</Typography>
        </Box>
        <Divider sx={{ marginBottom: "1.5rem", marginTop: "1rem" }} />
        <Box sx={{ alignItems: "center", display: "flex", gap: "1rem" }}>
          <Box>
            <img src={participantImg} alt="" />
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
            <span>Phone Number</span>
            <span>{student?.phone_number}</span>
          </Typography>
        </Box>
        <Box sx={infoSectionStyles}>
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            Course Enrolled
          </Typography>
          {student?.courses?.map((c) => (
            <Box key={c.name}>
              <Box>
                <Typography>{c.name}</Typography>
                <Typography>{c.instructor}</Typography>
              </Box>
              <span>Fees paid</span>
            </Box>
          ))}
        </Box>
        <Box className={formStyles.btn_group} sx={{ marginTop: "2rem" }}>
          <Button
            onClick={() => toggleDrawer(false)}
            className={formStyles.cancel_btn}
            variant="contained"
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={() => {
              toggleDrawer(false);
              openEditModal();
            }}
            className={formStyles.submit_btn}
            type="submit"
            variant="contained"
          >
            Edit
          </LoadingButton>
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
  },
};
