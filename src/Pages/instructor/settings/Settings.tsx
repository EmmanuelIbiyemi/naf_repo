import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SettingsHeader from "../../../components/SettingsHeader";
import React, { useRef } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { SettingsCombinedType } from "../../../types/user-settings";
import * as Yup from "yup";
import { Field, FieldProps, Form, Formik } from "formik";
import {
  FileUploadOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
// import formStyles from "../../../components/form/form.module.scss";
// import { LoadingButton } from "@mui/lab";
// import logo from "../../../assets/logo.png";

// type Props = {
//   settings?: SettingsType;
//   actions: {
//     submit: (settings: SettingsCombinedType) => void;
//     cancel: () => void;
//   };
// };

const Settings = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const initialValues: SettingsCombinedType & {
    newPassword: string;
    confirmPassword: string;
  } = {
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    title: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    title: Yup.string(),
    password: Yup.string().required("Required"),
    newPassword: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords much match")
      .required("Please confirm your password"),
  });

  const handleSubmit = (values: SettingsCombinedType) => {
    console.log(values);
  };

  const handlePasswordVisibility = (field: "current" | "new" | "confirm") => {
    switch (field) {
      case "current":
        setShowPassword(!showPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Settings"));

  // <Box ref={containerRef} className="content-container">
  //     <SettingsHeader
  //       additionalButton={{
  //         action: () => console.log("Hello"),
  //         text: "Contact Admin",
  //         heading: "Amina Rabiu Mustapha",
  //         subHeading: "RANK: NAFCONS SENIOR STAFF",
  //         image: `data:image/png;base64,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`,
  //       }}
  //     />
  //     <Box
  //       sx={{
  //         bgcolor: "#fff",
  //         borderRadius: "var(--border-radius)",
  //         marginInline: "var(--padding)",
  //         padding: "var(--padding)",
  //         margin: "1em",
  //       }}
  //     ></Box>

  return (
    <Box ref={containerRef} className="content-container">
      <SettingsHeader
        additionalButton={{
          action: () => console.log("Hello"),
          text: "Contact Admin",
          heading: "Amina Rabiu Mustapha",
          subHeading: "RANK: NAFCONS SENIOR STAFF",
          image: `data:image/png;base64,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`,
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontSize: "1.5rem", marginBottom: "1em", color: "#1D2026" }}
        >
          Account Settings
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {/* {({ errors, touched }) => ( */}
          <Form>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    border: "1px solid #E9EAF0",
                    padding: "2em",
                    width: "20em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "16em",
                      height: "16em",
                      bgcolor: "#f0f0f0",
                      borderRadius: 2,
                      display: "relative",
                      justifyContent: "center",
                      alignItems: "center",
                      // display:"relat"
                    }}
                  >
                    <img
                      src="data:image/png;base64,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"
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        // borderRadius: 8,
                        border: "1px solid black",
                        filter: "brightness(80%)",
                      }}
                    />
                    <Button
                      variant="outlined"
                      sx={{
                        height: 40,
                        display: "absolute",
                        bottom: 44,
                        backgroundColor: "#00000080",
                        fontSize: ".8rem",
                        width: "100%",
                        gap: 1,
                        color: "#fff",
                        borderRadius: 0,
                      }}
                    >
                      <FileUploadOutlined /> Upload Photo
                    </Button>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6E7485",
                      textAlign: "center",
                      fontSize: ".8rem",
                      marginTop: "1em",
                    }}
                  >
                    Image size should be under 1MB and image ration needs to be
                    1:1
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <label htmlFor="first_name" style={{ color: "#1D2026" }}>
                      First Name
                    </label>
                    <Field
                      name="first_name"
                      id="first_name"
                      placeholder="First name"
                      as={TextField}
                      style={{ marginBottom: "1em", width: "100%" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <label htmlFor="middle_name" style={{ color: "#1D2026" }}>
                      Middle Name
                    </label>
                    <Field
                      name="middle_name"
                      id="middle_name"
                      placeholder="Middle name"
                      as={TextField}
                      style={{ marginBottom: "1em", width: "100%" }}
                    />
                  </Box>
                </Box>
                <label htmlFor="last_name" style={{ color: "#1D2026" }}>
                  Last Name
                </label>
                <Field
                  name="last_name"
                  id="last_name"
                  placeholder="Last name"
                  as={TextField}
                  style={{ marginBottom: "1em" }}
                />

                <label htmlFor="email" style={{ color: "#1D2026" }}>
                  Email
                </label>
                <Field
                  name="email"
                  id="email"
                  placeholder="Email"
                  as={TextField}
                  style={{ marginBottom: "1em" }}
                />

                <label htmlFor="title" style={{ color: "#1D2026" }}>
                  TItle
                </label>
                <Field
                  name="title"
                  id="title"
                  as={TextField}
                  style={{ marginBottom: "1em" }}
                  placeholder="Your title, profession or small biography"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {initialValues.title.length}/50
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ alignSelf: "flex-start", width: "30%" }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Form>
          {/* )} */}
        </Formik>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Change password
        </Typography>
        <Formik
          initialValues={{
            password: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            password: Yup.string().required("Required"),
            newPassword: Yup.string()
              .min(8, "Password must be at least 8 characters")
              .required("Required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("newPassword")], "Passwords must match")
              .required("Required"),
          })}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {/* {({ errors, touched }) => ( */}
          <Form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "50%",
              }}
            >
              <Field name="password">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    type={showPassword ? "text" : "password"}
                    label="Current Password"
                    // error={touched.password && !!errors.password}
                    // helperText={touched.password && errors.password}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handlePasswordVisibility("current")
                              }
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Field>
              <Field name="newPassword">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    type={showNewPassword ? "text" : "password"}
                    label="New Password"
                    // error={touched.newPassword && !!errors.newPassword}
                    // helperText={touched.newPassword && errors.newPassword}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handlePasswordVisibility("new")}
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Field>
              <Field name="confirmPassword">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    // error={
                    //   touched.confirmPassword && !!errors.confirmPassword
                    // }
                    // helperText={
                    //   touched.confirmPassword && errors.confirmPassword
                    // }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handlePasswordVisibility("confirm")
                              }
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Field>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ alignSelf: "flex-start" }}
              >
                Change Password
              </Button>
            </Box>
          </Form>
          {/* )} */}
        </Formik>
      </Box>
    </Box>
  );
};

export default Settings;
