import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { Department } from "../../../../types/departments";
import { useParams } from "react-router-dom";

type Props = {
  department?: Department;
  actions: {
    submit: (department: Department) => Promise<void>;
    cancel: () => void;
  };
};

const DepartmentForm = ({ actions, department }: Props) => {
  const { faculty_id } = useParams();

  const initialValues: Department = {
    id: department?.id || 0,
    name: department?.name || "",
    faculty_id: department?.faculty_id || +(faculty_id || 1),
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    faculty_id: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: Department) => {
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
            {department ? "Update Department" : "Add Department"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: " 1fr",
            }}
          >
            <Box>
              <label htmlFor="name">Department Name</label>
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
              {department ? "Update Department" : "Add Department"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default DepartmentForm;
