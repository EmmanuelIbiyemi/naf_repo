import { Box, Button, Container, SxProps, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import loginBG from "../../assets/login-bg.svg";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { FormikTextField } from "../../components/form/TextField";

type LoginForm = {
  full_name: string;
  email: string;
  password: string;
};

const Login = () => {
  const initialValues = {
    full_name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: LoginForm) => {
    console.log(values);
  };

  return (
    <>
      <Box sx={containerStyles}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{ alignItems: "center", display: "flex", gap: "1rem" }}
          >
            <img src={logo} alt="logo" height={80} />
            <Typography>
              Nigerian Air Force
              <br />
              College of Nursing Sciences
            </Typography>
          </Link>
          <Button>Admin login</Button>
        </Container>
      </Box>
      <Container className="has_bg_image" sx={formContainerStyles}>
        <img className="bg" src={loginBG} alt="" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Box sx={formStyles}>
              <img src={logo} alt="" width={50} />
              <Typography sx={{ fontWeight: 700, marginBottom: "2rem" }}>
                USER LOGIN
              </Typography>
              <Box sx={{ display: "grid", gap: "1rem", width: 350 }}>
                <FormikTextField<LoginForm>
                  name="full_name"
                  label="Full Name"
                />
                <FormikTextField<LoginForm> name="email" label="Email" />
                <FormikTextField<LoginForm>
                  name="password"
                  label="Password"
                  placeholder="********"
                  type="password"
                />
                <LoadingButton
                  sx={submitBtnStyles}
                  type="submit"
                  variant="contained"
                >
                  Next
                </LoadingButton>
                <Typography sx={{ color: "rgba(102, 112, 133, 1)" }}>
                  Don’t have an account?{" "}
                  <Link
                    to=""
                    style={{ color: "rgba(21, 46, 136, 1)", fontWeight: 600 }}
                  >
                    Contact Admin
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Form>
        </Formik>
      </Container>
    </>
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
  },
};

const formContainerStyles: SxProps = {
  display: "grid",
  height: "100vh",
  placeItems: "center",
};

const formStyles: SxProps = {
  backgroundColor: "#fff",
  borderRadius: "5px",
  display: "grid",
  gap: "1rem",
  paddingBlock: "3rem 5rem",
  placeItems: "center",
  position: "relative",
  textAlign: "center",
  width: 600,
  zIndex: 2,
};

const submitBtnStyles: SxProps = {
  fontSize: "1rem",
  marginTop: "2rem",
  padding: ".7rem",
  textTransform: "capitalize",
};
