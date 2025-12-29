import { Box, Button, Typography, TextField, Alert, CircularProgress } from "@mui/material";
import { Upload } from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  useGetAdminSettingsQuery,
  useBulkUpdateSettingsMutation,
  SettingItem,
} from "../../../store/api/appSettings.api";
import { useAddMediaMutation } from "../../../store/api/media.api";
import EmptyState from "../../../components/EmptyState";

const ContactSettings = () => {
  const { data: settings, isLoading } = useGetAdminSettingsQuery();
  const [bulkUpdate, { isLoading: isUpdating }] = useBulkUpdateSettingsMutation();
  const [addMedia, { isLoading: isUploading }] = useAddMediaMutation();
  
  const [formValues, setFormValues] = useState({
    email: "",
    phone_number: "",
    x_url: "",
    facebook_url: "",
    youtube_url: "",
    logo_url: "",
    school_name_in_header: "",
    school_name: "",
    school_acronym: "",
    school_description: "",
    school_keywords: "",
    max_student_count: "",
  });
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      const settingsMap: Record<string, string> = {};
      settings.forEach((setting: SettingItem) => {
        settingsMap[setting.key] = setting.value;
      });
      
      setFormValues({
        email: settingsMap.email || "",
        phone_number: settingsMap.phone_number || "",
        x_url: settingsMap.x_url || "",
        facebook_url: settingsMap.facebook_url || "",
        youtube_url: settingsMap.youtube_url || "",
        logo_url: settingsMap.logo_url || "",
        school_name_in_header: settingsMap.school_name_in_header || "",
        school_name: settingsMap.school_name || "",
        school_acronym: settingsMap.school_acronym || "",
        school_description: settingsMap.school_description || "",
        school_keywords: settingsMap.school_keywords || "",
        max_student_count: settingsMap.max_student_count || "",
      });
    }
  }, [settings]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await addMedia(formData).unwrap();
      if (response.media && response.media.length > 0) {
        setFormValues((prev) => ({
          ...prev,
          logo_url: response.media[0].url,
        }));
        setSuccessMessage("Logo uploaded successfully!");
      }
    } catch (error) {
      setErrorMessage("Failed to upload logo. Please try again.");
      console.error("Failed to upload logo:", error);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      const settingsArray = Object.entries(formValues).map(([key, value]) => ({
        key,
        value,
      }));
      
      await bulkUpdate({ settings: settingsArray }).unwrap();
      setSuccessMessage("Settings updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to update settings. Please try again.");
      console.error("Failed to update settings:", error);
    }
  };

  const handleReset = () => {
    if (settings) {
      const settingsMap: Record<string, string> = {};
      settings.forEach((setting: SettingItem) => {
        settingsMap[setting.key] = setting.value;
      });
      
      setFormValues({
        email: settingsMap.email || "",
        phone_number: settingsMap.phone_number || "",
        x_url: settingsMap.x_url || "",
        facebook_url: settingsMap.facebook_url || "",
        youtube_url: settingsMap.youtube_url || "",
        logo_url: settingsMap.logo_url || "",
        school_name_in_header: settingsMap.school_name_in_header || "",
        school_name: settingsMap.school_name || "",
        school_acronym: settingsMap.school_acronym || "",
        school_description: settingsMap.school_description || "",
        school_keywords: settingsMap.school_keywords || "",
        max_student_count: settingsMap.max_student_count || "",
      });
    }
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <EmptyState
          title="Error loading settings"
          subTitle="There was a problem loading the settings. Please try again later."
        />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* School Information Section */}
      <Typography variant="h2" sx={sectionTitleStyle}>
        School Information
      </Typography>

      <Box sx={formContainerStyle} component="form" onSubmit={handleSubmit}>
        {/* Logo Upload Section */}
        <Box sx={logoSectionStyle}>
          <Box sx={logoContainerStyle}>
            {formValues.logo_url ? (
              <Box
                component="img"
                src={formValues.logo_url}
                alt="School Logo"
                sx={logoImageStyle}
              />
            ) : (
              <Box sx={logoPlaceholderStyle}>
                <Typography variant="body2" color="text.secondary">
                  No logo uploaded
                </Typography>
              </Box>
            )}
            <Button
              component="label"
              startIcon={
                isUploading ? <CircularProgress size={20} /> : <Upload />
              }
              variant="outlined"
              sx={uploadButtonStyle}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Logo"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
            </Button>
          </Box>
          <Typography sx={logoHelperTextStyle}>
            Upload your school logo. Recommended size: 200x200px
          </Typography>
        </Box>

        {/* Form Fields Section */}
        <Box sx={formFieldsStyle}>
          <TextField
            label="School Name"
            value={formValues.school_name}
            onChange={handleChange("school_name")}
            fullWidth
            sx={textFieldStyle}
            helperText="Full official name of the school"
          />
          
          <TextField
            label="School Acronym"
            value={formValues.school_acronym}
            onChange={handleChange("school_acronym")}
            fullWidth
            sx={textFieldStyle}
            helperText="Short form (e.g., NAFCONS)"
          />
          
          <TextField
            label="School Name in Header"
            value={formValues.school_name_in_header}
            onChange={handleChange("school_name_in_header")}
            fullWidth
            sx={textFieldStyle}
            helperText="Name displayed in header (supports HTML like <br />)"
          />
          
          <TextField
            label="School Description"
            value={formValues.school_description}
            onChange={handleChange("school_description")}
            fullWidth
            multiline
            rows={3}
            sx={textFieldStyle}
            helperText="Brief description for SEO and about pages"
          />
          
          <TextField
            label="SEO Keywords"
            value={formValues.school_keywords}
            onChange={handleChange("school_keywords")}
            fullWidth
            multiline
            rows={2}
            sx={textFieldStyle}
            helperText="Comma-separated keywords for search engine optimization"
          />
          
          <TextField
            label="Maximum Student Count"
            type="number"
            value={formValues.max_student_count}
            onChange={handleChange("max_student_count")}
            fullWidth
            sx={textFieldStyle}
            helperText="Maximum students for matriculation number generation (default: 5000)"
          />
        </Box>
      </Box>

      {/* Contact Information Section */}
      <Typography variant="h2" sx={{ ...sectionTitleStyle, mt: 4 }}>
        Contact Information
      </Typography>

      <Box sx={contactSectionStyle}>
        <TextField
          label="Email Address"
          type="email"
          value={formValues.email}
          onChange={handleChange("email")}
          fullWidth
          required
          sx={textFieldStyle}
          helperText="Primary contact email"
        />
        
        <TextField
          label="Phone Number"
          type="tel"
          value={formValues.phone_number}
          onChange={handleChange("phone_number")}
          fullWidth
          required
          sx={textFieldStyle}
          helperText="Primary contact phone number"
        />
      </Box>

      {/* Social Media Section */}
      <Typography variant="h2" sx={{ ...sectionTitleStyle, mt: 4 }}>
        Social Media Links
      </Typography>

      <Box sx={socialSectionStyle}>
        <TextField
          label="X (Twitter) URL"
          type="url"
          value={formValues.x_url}
          onChange={handleChange("x_url")}
          fullWidth
          sx={textFieldStyle}
          helperText="Full URL to your X/Twitter profile"
        />
        
        <TextField
          label="Facebook URL"
          type="url"
          value={formValues.facebook_url}
          onChange={handleChange("facebook_url")}
          fullWidth
          sx={textFieldStyle}
          helperText="Full URL to your Facebook page"
        />
        
        <TextField
          label="YouTube URL"
          type="url"
          value={formValues.youtube_url}
          onChange={handleChange("youtube_url")}
          fullWidth
          sx={textFieldStyle}
          helperText="Full URL to your YouTube channel"
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={actionButtonsStyle}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={isUpdating}
          sx={saveButtonStyle}
        >
          {isUpdating ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
        
        <Button
          type="button"
          variant="outlined"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

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
  mb: 2,
};

const logoSectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
};

const logoContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  width: "100%",
};

const logoImageStyle = {
  width: "200px",
  height: "200px",
  objectFit: "contain",
  borderRadius: "4px",
  border: "1px solid",
  borderColor: "divider",
  padding: "0.5rem",
};

const logoPlaceholderStyle = {
  width: "200px",
  height: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  border: "2px dashed",
  borderColor: "divider",
  bgcolor: "grey.50",
};

const uploadButtonStyle = {
  width: "100%",
};

const logoHelperTextStyle = {
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

const contactSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  padding: "2rem",
  boxShadow: 1,
  mb: 2,
};

const socialSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  padding: "2rem",
  boxShadow: 1,
};

const actionButtonsStyle = {
  display: "flex",
  gap: "1rem",
  mt: 3,
};

const saveButtonStyle = {
  bgcolor: "primary.main",
};

export default ContactSettings;
