import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { Programme } from "../../../../types/programmes";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
// import { FacultyType } from "../../../../types/faculty";
import { useEffect, useState } from "react";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";

type Props = {
  programme?: Programme;
  actions: {
    submit: (programme: Programme) => Promise<void>;
    cancel: () => void;
  };
};

const ProgrammeForm = ({ actions, programme }: Props) => {
  const { data: faculties } = useGetFacultiesQuery(null);
  const [facultyId, setFacultyId] = useState(0);
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  // const [currentFaculty, setCurrentFaculty] = useState<FacultyType>();

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

  const handleFacultyChange = (event: SelectChangeEvent<number>) => {
    const {
      target: { value },
    } = event;
    setFacultyId(value as number);
  };

  useEffect(() => {
    if (facultyId != 0) getDepartments(facultyId);
  }, [facultyId, getDepartments]);

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
              <label htmlFor="faculty_id">Select Faculty</label>
              <Select
                sx={{
                  padding: 0,
                  ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                }}
                id="faculty_id"
                value={facultyId || 0}
                onChange={handleFacultyChange}
                input={<OutlinedInput />}
              >
                <MenuItem value={0}>Select faculty</MenuItem>
                {faculties?.data.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                {departmentsState?.data?.data.map((department) => (
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
