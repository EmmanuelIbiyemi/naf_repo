import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";

export type Grade = {
  id?: number;
  point: number;
  name: string;
  program_id: number;
};

type Props = {
  grade?: Grade
  actions: {
    submit: (grade: Grade) => Promise<void>;
    cancel: () => void;
  };
};

const GradeForm = ({ actions, grade }: Props) => {

  const initialValues: Grade = {
    id: grade?.id || undefined,
    name: grade?.name || "",
    point: grade?.point || 0,
    program_id: grade?.program_id || 0,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    point: Yup.number().required("Point is required").min(0, "Point must be a positive number"),
    program_id: Yup.number().required("Program ID is required").positive("Program ID must be a positive number"),
  });

  const handleSubmit = async (values: Grade) => {
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
            {grade ? "Update Grade" : "Add Grade"}
          </Typography>
          <Box>
            <label htmlFor="name">Name</label>
            <Field id="name" name="name" />
            {errors.name && touched.name && <div>{errors.name}</div>}
          </Box>
          <Box>
            <label htmlFor="point">Point</label>
            <Field id="point" name="point" type="number" />
            {errors.point && touched.point && <div>{errors.point}</div>}
          </Box>
          <Box>
            <label htmlFor="program_id">Program ID</label>
            <Field id="program_id" name="program_id" type="number" />
            {errors.program_id && touched.program_id && <div>{errors.program_id}</div>}
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
              {grade ? "Update Grade" : "Add Grade"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default GradeForm;