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
import formStyles from "../../../../components/form/form.module.scss";
import {
  CourseCombinedType,
  CourseCreateType,
  CourseType,
} from "../../../../types/courses";
import { useGetInstructorsQuery } from "../../../../store/api/instructors.api";

const semesters = ["First Semester", "Second Semester"];
type Props = {
  course?: CourseCombinedType;
  actions: {
    submit: (course: CourseCombinedType) => Promise<void>;
    cancel: () => void;
  };
};

const CourseForm = ({ actions, course }: Props) => {
  const { data: instructors } = useGetInstructorsQuery(null);

  const isEditMode = !!course && "instructors" in course;
  const initialValues: CourseCreateType | CourseType = {
    id: (course as CourseType)?.id || 0,
    name: course?.name || "",
    code: course?.code || "",
    credit_unit: course?.credit_unit || 2,
    semester: course?.semester || "",
    instructor_ids: isEditMode
      ? course.instructors.map((ins) => ins.id).filter((id) => id !== undefined)
      : course?.instructor_ids || [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    code: Yup.string().required("Required"),
    credit_unit: Yup.number().required("Required"),
    semester: Yup.string().required("Required"),
    instructor_ids: Yup.array()
      .min(1, "Please select at least one instructor")
      .required("Required"),
  });

  const handleSubmit = async (values: CourseCombinedType) => {
    if ((values as CourseType).id == 0) delete (values as CourseType).id;
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
            {course ? "Update Course" : "Add Course"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="name">Course Name</label>
              <Field id="name" name="name" />
            </Box>
            <Box>
              <label htmlFor="code">Course Code</label>
              <Field id="code" name="code" />
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
              <label htmlFor="credit_unit">Credit Unit</label>
              <Field id="credit_unit" name="credit_unit" type="number" />
            </Box>
            <Box>
              <FormControl fullWidth>
                <label htmlFor="semester">Semester</label>
                <Select
                  sx={{
                    padding: 0,
                    ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                  }}
                  name="semester"
                  value={values.semester}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    setFieldValue("semester", value);
                  }}
                  input={<OutlinedInput />}
                >
                  {semesters.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box>
            <Box>
              <FormControl fullWidth>
                <label htmlFor="instructor_ids">Assign Instructors(s)</label>
                <Select
                  sx={{
                    padding: 0,
                    ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                  }}
                  multiple
                  id="instructor_ids"
                  name="instructor_ids"
                  value={
                    (values as CourseCreateType).instructor_ids
                      ? (values as CourseCreateType).instructor_ids
                      : (values as CourseType).instructors.map((ins) => ins.id)
                  }
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    setFieldValue("instructor_ids", value);
                  }}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const instructor = instructors?.data.find(
                          (instructor) => instructor.id === id
                        );
                        return (
                          <Chip
                            key={id}
                            label={`${instructor?.first_name} ${instructor?.last_name}`}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {instructors?.data.map((instructor) => (
                    <MenuItem key={instructor.id} value={instructor.id}>
                      {`${instructor.first_name} ${instructor.last_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              {course ? "Update Course" : "Add Course"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CourseForm;
