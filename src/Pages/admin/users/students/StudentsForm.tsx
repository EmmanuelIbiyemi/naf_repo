import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import {
  Student
} from "../../../../types/students";
import StudentCourseSelector from "../components/courseSelector";

type Props = {
  student?: Student
  actions: {
    submit: (student: Student) => Promise<void>;
    cancel: () => void;
  };
};

const StudentForm = ({ actions, student }: Props) => {

  const initialValues: Student = {
    id: student?.id || undefined,
    first_name: student?.first_name || "",
    last_name: student?.last_name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    courses: student?.courses || [],
    password: student?.password || "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().required("Password is required"),
    courses: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required(),
      })
    ).min(1, "At least one course is required"),
  });

  const handleSubmit = async (values: Student) => {
    await actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, errors, touched }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {student ? "Update Student" : "Add Student"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="first_name">First Name</label>
              <Field id="first_name" name="first_name" />
              {errors.first_name && touched.first_name && <div>{errors.first_name}</div>}
            </Box>
            <Box>
              <label htmlFor="last_name">Last Name</label>
              <Field id="last_name" name="last_name" />
              {errors.last_name && touched.last_name && <div>{errors.last_name}</div>}
            </Box>
          </Box>
          <Box>
            <label htmlFor="email">Email</label>
            <Field id="email" name="email" type="email" />
            {errors.email && touched.email && <div>{errors.email}</div>}
          </Box>
          <Box>
            <label htmlFor="phone">Phone</label>
            <Field id="phone" name="phone" />
            {errors.phone && touched.phone && <div>{errors.phone}</div>}
          </Box>
          <Box>
            <label htmlFor="password">Password</label>
            <Field id="password" name="password" type="password" />
            {errors.password && touched.password && <div>{errors.password}</div>}
          </Box>
          <Box>
            <StudentCourseSelector name="courses" />
          </Box>

          <Box className={formStyles.btn_group}>
            <Button
              onClick={() => actions.cancel()}
              className={formStyles.cancel_btn}
              variant="contained"
            >
              Cancel
            </Button>
            <LoadingButton
              className={formStyles.submit_btn}
              type="submit"
              variant="contained"
              disabled={!(isValid && dirty)}
            >
              {student ? "Update Student" : "Add Student"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default StudentForm;