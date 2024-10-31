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
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useGetLevelsMMutation } from "../../../../store/api/levels.api";

type Form = {
  faculty_id: number;
  department_id: number;
  program_id: number;
  level_id: number;
  fee: number;
};

type Props = {
  actions: {
    submit: (form: Form) => Promise<void>;
    cancel: () => void;
  };
};

const AddForm = ({ actions }: Props) => {
  const { data: faculties } = useGetFacultiesQuery(null);
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [getLevels, levelsState] = useGetLevelsMMutation();

  const initialValues = {
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
    level_id: 0,
    fee: 0,
  };

  const validationSchema = Yup.object({
    faculty_id: Yup.number().not([0]).required("Required"),
    department_id: Yup.number().not([0]).required("Required"),
    program_id: Yup.number().not([0]).required("Required"),
    level_id: Yup.number().not([0]).required("Required"),
  });

  const handleSubmit = async (values: Form) => {
    await actions.submit(values);
  };

  const handleFacultyChange = async (
    event: SelectChangeEvent<number>,
    setValue: (name: string, value: number) => void
  ) => {
    const {
      target: { value },
    } = event;

    setValue("faculty_id", +value);
    try {
      await getDepartments(+value);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDepartmentChange = async (
    event: SelectChangeEvent<number>,
    setValue: (name: string, value: number) => void
  ) => {
    const {
      target: { value },
    } = event;

    setValue("department_id", +value);
    try {
      await getPrograms(+value);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProgramChange = async (
    event: SelectChangeEvent<number>,
    setValue: (name: string, value: number) => void
  ) => {
    const {
      target: { value },
    } = event;

    setValue("program_id", +value);
    try {
      await getLevels(+value);
    } catch (error) {
      console.log(error);
    }
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
            Create Form
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <FormControl fullWidth>
              <label htmlFor="faculty_id">Faculty</label>
              <Select
                sx={{
                  padding: 0,
                  ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                }}
                name="faculty_id"
                value={values.faculty_id}
                onChange={(e) => handleFacultyChange(e, setFieldValue)}
                input={<OutlinedInput />}
              >
                <MenuItem value={0}>select faculty</MenuItem>
                {faculties?.data.map((f) => (
                  <MenuItem key={f.name + f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <label htmlFor="department_id">Department</label>
              <Select
                sx={{
                  padding: 0,
                  ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                }}
                name="department_id"
                value={values.department_id}
                onChange={(e) => handleDepartmentChange(e, setFieldValue)}
                input={<OutlinedInput />}
              >
                <MenuItem value={0}>select department</MenuItem>
                {departmentsState?.data?.data.map((d) => (
                  <MenuItem key={d.name + d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <label htmlFor="program_id">Programme</label>
              <Select
                sx={{
                  padding: 0,
                  ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                }}
                name="program_id"
                value={values.program_id}
                onChange={(e) => handleProgramChange(e, setFieldValue)}
                input={<OutlinedInput />}
              >
                <MenuItem value={0}>select program</MenuItem>
                {programsState.data?.data.map((p) => (
                  <MenuItem key={p.name + p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <label htmlFor="level_id">Level</label>
              <Select
                sx={{
                  padding: 0,
                  ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                }}
                name="level_id"
                value={values.level_id}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;

                  setFieldValue("level_id", value);
                }}
                input={<OutlinedInput />}
              >
                <MenuItem value={0}>select level</MenuItem>
                {levelsState.data?.data.map((p) => (
                  <MenuItem key={p.name + p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <label htmlFor="fee">Fee</label>
              <Field type="number" id="fee" name="fee" />
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
              Create Form
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddForm;
