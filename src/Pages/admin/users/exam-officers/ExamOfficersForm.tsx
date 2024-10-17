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
  ExamOfficer
} from "../../../../types/examOfficers";

type Props = {
  examOfficer?: ExamOfficer
  actions: {
    submit: (examOfficer: ExamOfficer) => Promise<void>;
    cancel: () => void;
  };
};

const ExamOfficerForm = ({ actions, examOfficer }: Props) => {

  const initialValues: ExamOfficer = {
    id: examOfficer?.id || 0,
    first_name: examOfficer?.first_name || "",
    last_name: examOfficer?.last_name || "",
    address: examOfficer?.address || "",
    email: examOfficer?.email || "",
    phone: examOfficer?.phone || "",
    photo: examOfficer?.photo || "",
    role: examOfficer?.role || "",
    department: examOfficer?.department || "",
    faculty: examOfficer?.faculty || "",
    created_at: examOfficer?.created_at || "",
    updated_at: examOfficer?.updated_at || "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("Role is required"),
    department: Yup.string().required("Department is required"),
    faculty: Yup.string().required("Faculty is required"),
  });

  const handleSubmit = async (values: ExamOfficer) => {
    if ((values as ExamOfficer).id == 0) delete (values as ExamOfficer).id;
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
            {examOfficer ? "Update ExamOfficer" : "Add ExamOfficer"}
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
            <label htmlFor="address">Address</label>
            <Field id="address" name="address" />
            {errors.address && touched.address && <div>{errors.address}</div>}
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
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
          </Box>
          <Box>
            <label htmlFor="role">Role</label>
            <Field id="role" name="role" />
            {errors.role && touched.role && <div>{errors.role}</div>}
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="department">Department</label>
              <Field id="department" name="department" />
              {errors.department && touched.department && <div>{errors.department}</div>}
            </Box>
            <Box>
              <label htmlFor="faculty">Faculty</label>
              <Field id="faculty" name="faculty" />
              {errors.faculty && touched.faculty && <div>{errors.faculty}</div>}
            </Box>
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
              {examOfficer ? "Update ExamOfficer" : "Add ExamOfficer"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ExamOfficerForm;