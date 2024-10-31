import { useState } from "react";
import { 
  Box, 
  Button, 
  Container, 
  SxProps, 
  Typography,
  Alert,
  IconButton,
  CircularProgress 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import loginBG from "../../assets/login-bg.svg";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { FormikTextField } from "../../components/form/TextField";
import { useLoginMutation } from "../../store/api/auth.api";
import { UserLoginType } from "../../types/users";
import { login } from "../../store/auth.slice";
import { useAppDispatch } from "../../store/hooks";

interface LoginError {
  data?: {
    message?: string;
  };
  status?: number;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialValues: UserLoginType = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const getInitialRoute = (role: string) => {
    const roleRoutes = {
      participant: "/student/dashboard",
      admin: "/",
      instructor: "/instructor"
    };
    return roleRoutes[role as keyof typeof roleRoutes] || "/login";
  };

  const handleSubmit = async (
    values: UserLoginType, 
    { setSubmitting }: FormikHelpers<UserLoginType>
  ) => {
    try {
      setError(null);
      const response = await loginUser(values).unwrap();
      
      // Log the response to debug
      console.log('Login response:', response);
      
      if (!response.user?.role) {
        throw new Error('User role not found in response');
      }

      dispatch(login(response));
      
      // Navigate based on role
      const initialRoute = getInitialRoute(response.user.role);
      console.log('Navigating to:', initialRoute);
      navigate(initialRoute);
      
    } catch (error) {
      console.error('Login error:', error);
      const loginError = error as LoginError;
      setError(
        loginError.data?.message || 
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Custom props for FormikTextField components
  const emailFieldProps = {
    name: "email" as keyof UserLoginType,
    label: "Email",
    placeholder: "Enter your email",
  };

  const passwordFieldProps = {
    name: "password" as keyof UserLoginType,
    label: "Password",
    placeholder: "Enter your password",
    type: showPassword ? "text" : "password",
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={containerStyles}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{ 
              alignItems: "center", 
              display: "flex", 
              gap: "1rem",
              textDecoration: "none" 
            }}
          >
            <img src={logo} alt="logo" height={80} />
            <Typography>
              Nigerian Air Force
              <br />
              College of Nursing Sciences
            </Typography>
          </Link>
          <Button variant="outlined" color="inherit">
            Admin login
          </Button>
        </Container>
      </Box>
      
      <Container className="has_bg_image" sx={formContainerStyles}>
        <img
          className="bg"
          src={loginBG}
          alt=""
          style={{ position: "absolute", maxWidth: "100%" }}
        />
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box sx={formStyles}>
                <img src={logo} alt="College logo" width={50} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  USER LOGIN
                </Typography>
                
                {error && (
                  <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{ mb: 2, width: "100%", maxWidth: 350 }}
                  >
                    {error}
                  </Alert>
                )}

                <Box sx={{ display: "grid", gap: "1rem", width: 350 }}>
                  <FormikTextField<UserLoginType> 
                    {...emailFieldProps}
                  />
                  
                  <Box sx={{ position: "relative" }}>
                    <FormikTextField<UserLoginType>
                      {...passwordFieldProps}
                    />
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "20px",
                        transform: "translateY(-15px)",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>

                  <LoadingButton
                    sx={submitBtnStyles}
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    loadingIndicator={
                      <CircularProgress color="inherit" size={16} />
                    }
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </LoadingButton>

                  <Typography sx={helpTextStyles}>
                    Don't have an account?{" "}
                    <Link
                      to="/contact"
                      style={{ 
                        color: "rgba(21, 46, 136, 1)", 
                        fontWeight: 600,
                        textDecoration: "none" 
                      }}
                    >
                      Contact Admin
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

export default Login;

const containerStyles: SxProps = {
  paddingBlock: "1rem",
  bgcolor: "primary.main",
  color: "primary.contrastText",
  "p,button": {
    color: "inherit",
  },
  ".MuiTypography-root": {
    fontWeight: "600",
    fontSize: "1.6rem",
  },
  ".MuiButton-root": {
    fontSize: "1.2rem",
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.1)",
    },
  },
};

const formContainerStyles: SxProps = {
  display: "grid",
  flex: 1,
  placeItems: "center",
  position: "relative",
  py: 4,
};

const formStyles: SxProps = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  display: "grid",
  gap: "1rem",
  padding: "3rem",
  placeItems: "center",
  position: "relative",
  textAlign: "center",
  width: "100%",
  maxWidth: 600,
  zIndex: 2,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};

const submitBtnStyles: SxProps = {
  fontSize: "1rem",
  marginTop: "2rem",
  padding: ".7rem",
  textTransform: "none",
  fontWeight: 600,
};

const helpTextStyles: SxProps = {
  color: "rgba(102, 112, 133, 1)",
  fontSize: "0.875rem",
  "& a:hover": {
    textDecoration: "underline",
  },
};