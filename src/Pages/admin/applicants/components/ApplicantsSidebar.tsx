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
import { ApplicantType2 } from "../../../../types/applicants";

type Props = {
  applicant: ApplicantType2 | undefined;
  toggleDrawer: () => void;
};

const ApplicantSidebar = ({ applicant, toggleDrawer }: Props) => {
  return (
    <Drawer open={Boolean(applicant)} onClose={toggleDrawer} anchor="right">
      <Box sx={sideBarStyles}>
        <Box>
          <Typography variant="h5">Preview Infomation</Typography>
        </Box>
        <Divider sx={{ marginBottom: "1.5rem", marginTop: "1rem" }} />
        <Box sx={{ alignItems: "center", display: "flex", gap: "1rem" }}>
          <Box>
            <Typography variant="h6">
              {applicant?.data.first_name} {applicant?.data.last_name}
            </Typography>
            <Typography
              sx={{ alignItems: "center", display: "flex", gap: ".5rem" }}
            >
              <Mail
                sx={{ color: "rgba(179, 179, 179, 1)", fontSize: "1.2rem" }}
              />{" "}
              {applicant?.data.reg_number}
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
            <span>{applicant?.data.first_name}</span>
          </Typography>
          <Typography>
            <span>Last Name</span>
            <span>{applicant?.data.last_name}</span>
          </Typography>
          <Typography>
            <span>Gender</span>
            <span>{applicant?.data.gender}</span>
          </Typography>
          <Typography>
            <span>Date of Birth</span>
            <span>{applicant?.data.dob}</span>
          </Typography>
          <Typography>
            <span>Email</span>
            <span>{applicant?.data.email}</span>
          </Typography>
          <Typography>
            <span>Phone Number</span>
            <span>{applicant?.data.phone}</span>
          </Typography>
        </Box>
        <Box sx={infoSectionStyles}>
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            Application
          </Typography>

          <Typography>
            <span>Session</span>
            <span>{applicant?.session}</span>
          </Typography>
          <Typography>
            <span>Status</span>
            <span>{applicant?.status}</span>
          </Typography>
          <Typography>
            <span>Program</span>
            <span>{applicant?.program.name}</span>
          </Typography>
          <Typography>
            <span>Level</span>
            <span>{applicant?.level.name}</span>
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

export default ApplicantSidebar;

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
