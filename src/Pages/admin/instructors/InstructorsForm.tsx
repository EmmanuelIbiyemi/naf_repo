import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../components/form/form.module.scss";
import {
  InstructorCombinedType,
  InstructorCreateType,
  InstructorType,
} from "../../../types/instructors";

type Props = {
  instructor?: InstructorType;
  actions: {
    submit: (instructor: InstructorCombinedType) => void;
    cancel: () => void;
  };
};

const InstructorForm = ({ actions, instructor }: Props) => {
  const initialValues: InstructorCreateType = {
    first_name: instructor?.first_name || "",
    last_name: instructor?.last_name || "",
    email: instructor?.email || "",
    phone: instructor?.phone || "",
    photo: instructor?.photo || "",
    address: instructor?.address || "",
    created_at: instructor?.created_at || "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: InstructorCombinedType) => {
    if (instructor) console.log("edit");
    else console.log("add");
    actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            Invite Instructors
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="name">First Name</label>
              <Field id="name" name="first_name" />
            </Box>
            <Box>
              <label htmlFor="last-name">Last Name</label>
              <Field id="last-name" name="last_name" />
            </Box>
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
              <Field id="email" name="email" />
            </Box>
            <Box>
              <label htmlFor="phone-number">Phone Number</label>
              <Field id="phone-number" name="phone" placeholder="+234" />
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
              Add Instructor
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default InstructorForm;
