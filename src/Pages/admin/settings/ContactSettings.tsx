import { Box, Button, Typography, TextField, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
  useGetAdminSettingsQuery,
  useBulkUpdateSettingsMutation,
  SettingItem,
} from "../../../store/api/appSettings.api";
import { useAddMediaMutation } from "../../../store/api/media.api";

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
      });
    }
  }, [settings]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      setSuccessMessage("Contact settings updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to update settings. Please try again.");
      console.error("Failed to update settings:", error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        School & Contact Settings
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Manage information displayed throughout the application. These settings override environment variables.
      </Typography>

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

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          School Information
        </Typography>
        
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            School Logo
          </Typography>
          <Button
            component="label"
            variant="outlined"
            disabled={isUploading}
            sx={{ mb: 1 }}
          >
            {isUploading ? "Uploading..." : "Upload Logo"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </Button>
          {formValues.logo_url && (
            <Box sx={{ mt: 2 }}>
              <img
                src={formValues.logo_url}
                alt="School Logo"
                style={{ maxWidth: "200px", maxHeight: "100px", objectFit: "contain" }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
                {formValues.logo_url}
              </Typography>
            </Box>
          )}
        </Box>
        
        <TextField
          label="School Name (Header)"
          value={formValues.school_name_in_header}
          onChange={handleChange("school_name_in_header")}
          fullWidth
          helperText="School name as displayed in header (supports HTML like <br />)"
        />
        
        <TextField
          label="School Name"
          value={formValues.school_name}
          onChange={handleChange("school_name")}
          fullWidth
          helperText="Full school name"
        />
        
        <TextField
          label="School Acronym"
          value={formValues.school_acronym}
          onChange={handleChange("school_acronym")}
          fullWidth
          helperText="Short acronym (e.g., NAFCONS)"
        />
        
        <TextField
          label="School Description"
          value={formValues.school_description}
          onChange={handleChange("school_description")}
          fullWidth
          multiline
          rows={3}
          helperText="Brief description of the school"
        />
        
        <TextField
          label="School Keywords"
          value={formValues.school_keywords}
          onChange={handleChange("school_keywords")}
          fullWidth
          multiline
          rows={4}
          helperText="SEO keywords (comma-separated)"
        />
        
        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Contact Information
        </Typography>
        
        <TextField
          label="Email Address"
          type="email"
          value={formValues.email}
          onChange={handleChange("email")}
          fullWidth
          required
        />
        
        <TextField
          label="Phone Number"
          type="tel"
          value={formValues.phone_number}
          onChange={handleChange("phone_number")}
          fullWidth
          required
        />
        
        <TextField
          label="X (Twitter) URL"
          type="url"
          value={formValues.x_url}
          onChange={handleChange("x_url")}
          fullWidth
          helperText="Full URL to your X/Twitter profile"
        />
        
        <TextField
          label="Facebook URL"
          type="url"
          value={formValues.facebook_url}
          onChange={handleChange("facebook_url")}
          fullWidth
          helperText="Full URL to your Facebook page"
        />
        
        <TextField
          label="YouTube URL"
          type="url"
          value={formValues.youtube_url}
          onChange={handleChange("youtube_url")}
          fullWidth
          helperText="Full URL to your YouTube channel"
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isUpdating}
            sx={{ px: 4 }}
          >
            Save Changes
          </LoadingButton>
          
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
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
                });
              }
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactSettings;
