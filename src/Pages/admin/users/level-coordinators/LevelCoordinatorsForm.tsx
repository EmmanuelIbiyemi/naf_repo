import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";

export type LevelCoordinator = {
  id?: number;
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  role: string;
  updated_at: string;
  department: string;
  faculty: string;
};

type Props = {
  levelCoordinator?: LevelCoordinator
  actions: {
    submit: (levelCoordinator: LevelCoordinator) => Promise<void>;
    cancel: () => void;
  };
};

const LevelCoordinatorForm = ({ actions, levelCoordinator }: Props) => {

  const initialValues: LevelCoordinator = {
    id: levelCoordinator?.id || undefined,
    address: levelCoordinator?.address || "",
    created_at: levelCoordinator?.created_at || new Date().toISOString(),
    email: levelCoordinator?.email || "",
    first_name: levelCoordinator?.first_name || "",
    last_name: levelCoordinator?.last_name || "",
    phone: levelCoordinator?.phone || "",
    photo: levelCoordinator?.photo || "",
    role: levelCoordinator?.role || "",
    updated_at: levelCoordinator?.updated_at || new Date().toISOString(),
    department: levelCoordinator?.department || "",
    faculty: levelCoordinator?.faculty || "",
  };

  const validationSchema = Yup.object({
    address: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
    department: Yup.string().required("Required"),
    faculty: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: LevelCoordinator) => {
    if (!values.id) delete values.id;
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
            {levelCoordinator ? "Update Level Coordinator" : "Add Level Coordinator"}
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
            </Box>
            <Box>
              <label htmlFor="last_name">Last Name</label>
              <Field id="last_name" name="last_name" />
            </Box>
            <Box>
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" />
            </Box>
            <Box>
              <label htmlFor="phone">Phone</label>
              <Field id="phone" name="phone" />
            </Box>
            <Box>
              <label htmlFor="address">Address</label>
              <Field id="address" name="address" />
            </Box>
            <Box>
              <label htmlFor="role">Role</label>
              <Field id="role" name="role" />
            </Box>
            <Box>
              <label htmlFor="department">Department</label>
              <Field id="department" name="department" />
            </Box>
            <Box>
              <label htmlFor="faculty">Faculty</label>
              <Field id="faculty" name="faculty" />
            </Box>
            <Box>
              <label htmlFor="photo">Photo URL</label>
              <Field id="photo" name="photo" />
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
              {levelCoordinator ? "Update Level Coordinator" : "Add Level Coordinator"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LevelCoordinatorForm;