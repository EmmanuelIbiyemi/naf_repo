import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { Department } from "../../../../types/departments";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";

type Props = {
  department?: Department;
  actions: {
    submit: (department: Department) => Promise<void>;
    cancel: () => void;
  };
};

const DepartmentForm = ({ actions, department }: Props) => {
  const { data: faculties } = useGetFacultiesQuery(null);

  const initialValues: Department = {
    id: department?.id || 0,
    name: department?.name || "",
    faculty_id: department?.faculty_id || 1,
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
      {({ isValid, dirty, values, setFieldValue }) => (
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
          <Box>
            <FormControl fullWidth>
              <label htmlFor="faculty_id">Select Faculty</label>
              <Select
                sx={{
                  padding: 0,
                  ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                }}
                name="faculty_id"
                value={values.faculty_id}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;

                  setFieldValue("faculty_id", value);
                }}
                input={<OutlinedInput />}
              >
                {faculties?.data.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
