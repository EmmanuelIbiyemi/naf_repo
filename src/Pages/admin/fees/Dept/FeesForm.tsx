import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";

export type Fee = {
  id?: number;
  name: string;
  fee: number;
  level_id: number;
  faculty: string;
  Department: string;
  level: string;
};

type Props = {
  fee?: Fee
  actions: {
    submit: (fee: Fee) => Promise<void>;
    cancel: () => void;
  };
};

const FeeForm = ({ actions, fee }: Props) => {

  const initialValues: Fee = {
    id: fee?.id || undefined,
    name: fee?.name || "",
    fee: fee?.fee || 0,
    level_id: fee?.level_id || 0,
    faculty: fee?.faculty || "",
    Department: fee?.Department || "",
    level: fee?.level || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    fee: Yup.number().required("Fee is required").min(0, "Fee must be a positive number"),
    level_id: Yup.number().required("Level ID is required").positive("Level ID must be a positive number"),
    faculty: Yup.string().required("Faculty is required"),
    Department: Yup.string().required("Department is required"),
    level: Yup.string().required("Level is required"),
  });

  const handleSubmit = async (values: Fee) => {
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
            {fee ? "Update Fee" : "Add Fee"}
          </Typography>
          <Box>
            <label htmlFor="name">Name</label>
            <Field id="name" name="name" />
            {errors.name && touched.name && <div>{errors.name}</div>}
          </Box>
          <Box>
            <label htmlFor="fee">Fee</label>
            <Field id="fee" name="fee" type="number" />
            {errors.fee && touched.fee && <div>{errors.fee}</div>}
          </Box>
          <Box>
            <label htmlFor="level_id">Level ID</label>
            <Field id="level_id" name="level_id" type="number" />
            {errors.level_id && touched.level_id && <div>{errors.level_id}</div>}
          </Box>
          <Box>
            <label htmlFor="faculty">Faculty</label>
            <Field id="faculty" name="faculty" />
            {errors.faculty && touched.faculty && <div>{errors.faculty}</div>}
          </Box>
          <Box>
            <label htmlFor="Department">Department</label>
            <Field id="Department" name="Department" />
            {errors.Department && touched.Department && <div>{errors.Department}</div>}
          </Box>
          <Box>
            <label htmlFor="level">Level</label>
            <Field id="level" name="level" />
            {errors.level && touched.level && <div>{errors.level}</div>}
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
              {fee ? "Update Fee" : "Add Fee"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FeeForm;