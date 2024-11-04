import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Upload } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { 
  useGetParticipantQuery, 
  useUpdateParticipantMutation 
} from '../../../store/api/participants.api';
import EmptyState from "../../../components/EmptyState";
import { selectCurrentUser } from "../../../store/auth.slice";

const AccountSettings = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const participantId = user.id; // Replace with actual ID source
  const { data: participantData, isLoading } = useGetParticipantQuery(participantId);
  const [updateParticipant, { isLoading: isUpdating }] = useUpdateParticipantMutation();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    photo: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    dispatch(setPageName("Account settings"));
  }, [dispatch]);

  useEffect(() => {
    if (participantData?.data) {
      const { data } = participantData;
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        photo: data.photo || '',
      });
    }
  }, [participantData]);

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePasswordChange = (field: keyof typeof passwords) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswords(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleClickShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB
        setError('Image size should be under 1MB');
        return;
      }
      
      // Here you would typically upload to your server/cloud storage
      // For now, we'll create a base64 preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setError('');
      setSuccess('');
      
      await updateParticipant({ 
        id: participantId,
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          photo: formData.photo,
        }
      }).unwrap();
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile' + err);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }
    // Implement password change API call here
    setSuccess('Password changed successfully');
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        padding: "2rem",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!participantData) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <EmptyState
          title="Error loading settings"
          subTitle="There was a problem loading your information. Please try again later."
        />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      )}

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
              src={formData.photo || "/api/placeholder/200/200"}
              alt="Profile"
              sx={profileImageStyle}
            />
            <Button
              component="label"
              startIcon={<Upload />}
              variant="outlined"
              sx={uploadButtonStyle}
            >
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </Button>
          </Box>
          <Typography sx={photoHelperTextStyle}>
            Image size should be under 1MB and image ratio needs to be 1:1
          </Typography>
        </Box>

        {/* Form Fields Section */}
        <Box sx={formFieldsStyle}>
            <TextField
              label="First name"
              value={formData.first_name}
              onChange={handleInputChange('first_name')}
              fullWidth
              sx={textFieldStyle}
            />
          
          <TextField
            label="Last Name"
            value={formData.last_name}
            onChange={handleInputChange('last_name')}
            fullWidth
            sx={textFieldStyle}
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={handleInputChange('email')}
            fullWidth
            sx={textFieldStyle}
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            fullWidth
            sx={textFieldStyle}
          />
          <Button
            variant="contained"
            sx={saveButtonStyle}
            onClick={handleSaveChanges}
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Save Changes'}
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
          value={passwords.current}
          onChange={handlePasswordChange('current')}
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
          value={passwords.new}
          onChange={handlePasswordChange('new')}
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
          value={passwords.confirm}
          onChange={handlePasswordChange('confirm')}
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
          onClick={handleChangePassword}
          sx={changePasswordButtonStyle}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

// Styles remain the same
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

export default AccountSettings;