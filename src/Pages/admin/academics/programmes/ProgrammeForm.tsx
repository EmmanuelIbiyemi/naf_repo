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
import { Programme } from "../../../../types/programmes";
import { useGetDepartmentsQuery } from "../../../../store/api/departments.api";
import { useLocation } from "react-router-dom";

type Props = {
  programme?: Programme;
  actions: {
    submit: (programme: Programme) => Promise<void>;
    cancel: () => void;
  };
};

const ProgrammeForm = ({ actions, programme }: Props) => {
  const location = useLocation();
  const { data: departments } = useGetDepartmentsQuery(
    location.state.faculty_id
  );

  const initialValues: Programme = {
    id: programme?.id || 0,
    name: programme?.name || "",
    department_id: programme?.department_id || 0,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    department_id: Yup.number()
      .required("Required")
      .notOneOf([0], "Department ID cannot be 0"),
  });

  const handleSubmit = async (values: Programme) => {
    if (values.id == 0) delete values.id;
    await actions.submit(values);
    console.log(values);
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
            {programme ? "Update Programme" : "Add Programme"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr",
            }}
          >
            <Box>
              <label htmlFor="name">Programme Name</label>
              <Field id="name" name="name" />
            </Box>
          </Box>

          <Box>
            <FormControl fullWidth>
              <label htmlFor="department_id">Select Department</label>
              <Select
                sx={{
                  padding: 0,
                  ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                }}
                id="department_id"
                name="department_id"
                value={values.department_id || 0}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setFieldValue("department_id", value);
                }}
                input={<OutlinedInput />}
              >
                <MenuItem value={0}>select department</MenuItem>
                {departments?.data.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
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
              {programme ? "Update Programme" : "Add Programme"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProgrammeForm;
