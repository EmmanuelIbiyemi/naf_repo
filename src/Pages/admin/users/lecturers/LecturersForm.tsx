import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { Lecturer } from "../../../../types/lecturers";

type Props = {
  lecturer?: Lecturer;
  actions: {
    submit: (lecturer: Lecturer) => Promise<void>;
    cancel: () => void;
  };
};

const LecturerForm = ({ actions, lecturer }: Props) => {
  const initialValues: Lecturer = {
    id: lecturer?.id || 0,
    first_name: lecturer?.first_name || "",
    last_name: lecturer?.last_name || "",
    address: lecturer?.address || "",
    email: lecturer?.email || "",
    phone: lecturer?.phone || "",
    photo: lecturer?.photo || "",
    created_at: lecturer?.created_at || "",
    updated_at: lecturer?.updated_at || "",
    user_id: lecturer?.user_id || 0,
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
  });

  const handleSubmit = async (values: Lecturer) => {
    if ((values as Lecturer).id == 0) delete (values as Lecturer).id;
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
            {lecturer ? "Update Lecturer" : "Add Lecturer"}
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
              {errors.first_name && touched.first_name && (
                <div>{errors.first_name}</div>
              )}
            </Box>
            <Box>
              <label htmlFor="last_name">Last Name</label>
              <Field id="last_name" name="last_name" />
              {errors.last_name && touched.last_name && (
                <div>{errors.last_name}</div>
              )}
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
              {lecturer ? "Update Lecturer" : "Add Lecturer"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LecturerForm;
