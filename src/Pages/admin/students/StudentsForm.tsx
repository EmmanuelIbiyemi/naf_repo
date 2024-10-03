import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../components/form/form.module.scss";
import { StudentCombinedType, StudentType } from "../../../types/students";
import { CourseType } from "../../../types/courses";

const courses: CourseType[] = [
  { id: 1, instructor: "instructor 1", name: "Course 1" },
  { id: 2, instructor: "instructor 2", name: "Course 2" },
  { id: 3, instructor: "instructor 3", name: "Course 3" },
];

type Props = {
  student?: StudentType;
  actions: {
    submit: (student: StudentCombinedType) => void;
    cancel: () => void;
  };
};

const StudentsForm = ({ actions, student }: Props) => {
  const initialValues = {
    id: student?.id,
    first_name: student ? student.first_name : "",
    last_name: student ? student.last_name : "",
    courses: student ? student.courses : [],
    email: student ? student.email : "",
    password: student ? student.password : "",
    phone_number: student ? student.phone_number : "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    courses: Yup.array()
      .min(1, "Please select at least one course")
      .required("Required"),
    email: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    phone_number: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: StudentCombinedType) => {
    if (student) console.log("edit");
    else console.log("add");
    actions.submit(values);
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
            Invite Students
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
              <Field id="phone-number" name="phone_number" placeholder="+234" />
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
              <FormControl fullWidth>
                <label htmlFor="courses">Assign Course(s) (optional)</label>
                <Select
                  sx={{
                    padding: 0,
                    ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                  }}
                  multiple
                  name="courses"
                  value={values.courses.map((c) => c.name) || []}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    const foundCourses = courses.filter((c) =>
                      value.includes(c.name)
                    );
                    setFieldValue("courses", foundCourses);
                  }}
                  input={<OutlinedInput id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((course) => (
                        <Chip key={course} label={course} />
                      ))}
                    </Box>
                  )}
                >
                  {courses.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <label htmlFor="password">Create Password</label>
              <Field
                id="password"
                name="password"
                placeholder="Set default password for user"
              />
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
              Add Student
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default StudentsForm;
