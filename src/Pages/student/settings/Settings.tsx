import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, Upload } from "@mui/icons-material";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useEffect } from "react";

const AccountSettings = () => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    dispatch(setPageName("Account settings"));
  },);

  const handleClickShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Account Settings Section */}
      <Typography variant="h2" sx={sectionTitleStyle}>
        Account settings
      </Typography>
      
      <Box sx={formContainerStyle}>
        {/* Photo Upload Section */}
        <Box sx={photoSectionStyle}>
          <Box sx={photoContainerStyle}>
            <Box
              component="img"
              src="/api/placeholder/200/200"
              alt="Profile"
              sx={profileImageStyle}
            />
            <Button
              startIcon={<Upload />}
              variant="outlined"
              sx={uploadButtonStyle}
            >
              Upload Photo
            </Button>
          </Box>
          <Typography sx={photoHelperTextStyle}>
            Image size should be under 1MB and image ration needs to be 1:1
          </Typography>
        </Box>

        {/* Form Fields Section */}
        <Box sx={formFieldsStyle}>
          <Box sx={nameFieldsContainerStyle}>
            <TextField
              label="First name"
              defaultValue="Amina"
              fullWidth
              sx={textFieldStyle}
            />
            <TextField
              label="Middle name"
              fullWidth
              sx={textFieldStyle}
            />
          </Box>
          <TextField
            label="Last Name"
            defaultValue="Mustapha"
            fullWidth
            sx={textFieldStyle}
          />
          <TextField
            label="Email"
            defaultValue="aminar222@gmail.com"
            fullWidth
            sx={textFieldStyle}
          />
          <TextField
            label="Title"
            placeholder="Your title, profession or small biography"
            fullWidth
            multiline
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color="textSecondary">0/50</Typography>
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
          />
          <Button
            variant="contained"
            sx={saveButtonStyle}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Change Password Section */}
      <Typography variant="h2" sx={{ ...sectionTitleStyle, mt: 4 }}>
        Change password
      </Typography>
      
      <Box sx={passwordSectionStyle}>
        <TextField
          label="Current Password"
          type={showPassword.current ? "text" : "password"}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("current")}
                  edge="end"
                >
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyle}
        />
        <TextField
          label="New Password"
          type={showPassword.new ? "text" : "password"}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("new")}
                  edge="end"
                >
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyle}
        />
        <TextField
          label="Confirm Password"
          type={showPassword.confirm ? "text" : "password"}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("confirm")}
                  edge="end"
                >
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyle}
        />
        <Button
          variant="contained"
          sx={changePasswordButtonStyle}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

export default AccountSettings;

// Styles
const sectionTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: 500,
  marginBottom: "1.5rem",
};

const formContainerStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
  gap: "2rem",
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  padding: "2rem",
  boxShadow: 1,
};

const photoSectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
};

const photoContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  width: "100%",
};

const profileImageStyle = {
  width: "200px",
  height: "200px",
  objectFit: "cover",
  borderRadius: "4px",
};

const uploadButtonStyle = {
  width: "100%",
};

const photoHelperTextStyle = {
  fontSize: "0.75rem",
  color: "text.secondary",
  textAlign: "center",
};

const formFieldsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const nameFieldsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
};

const textFieldStyle = {
  bgcolor: "#fff",
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
  },
};

const saveButtonStyle = {
  mt: 1,
  width: "fit-content",
  alignSelf: "flex-start",
  bgcolor: "primary.main",
};

const passwordSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  padding: "2rem",
  boxShadow: 1,
  maxWidth: "400px",
};

const changePasswordButtonStyle = {
  mt: 1,
  width: "fit-content",
  bgcolor: "primary.main",
};