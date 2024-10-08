import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { Faculty } from "../../../../types/faculties";

type Props = {
  faculty?: Faculty
  actions: {
    submit: (faculty: Faculty) => Promise<void>;
    cancel: () => void;
  };
};

const FacultyForm = ({ actions, faculty }: Props) => {

  const initialValues: Faculty = {
    id: faculty?.id || 0,
    name: faculty?.name || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: Faculty) => {
    if (values.id == 0) delete values.id;
    await actions.submit(values);
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
            {faculty ? "Update Faculty" : "Add Faculty"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr",
            }}
          >
            <Box>
              <label htmlFor="name">Faculty Name</label>
              <Field id="name" name="name" />
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
              {faculty ? "Update Faculty" : "Add Faculty"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FacultyForm;
