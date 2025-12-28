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
import {
  CourseCombinedType,
  CourseCreateType,
  CourseType,
} from "../../../../types/courses";
import { InstructorType } from "../../../../types/instructors";
import { useGetSemestersQuery } from "../../../../store/api/semesters.api";
import InstructorDropdown from "../../../../components/InstructorDropdown";

type Props = {
  course?: CourseCombinedType;
  actions: {
    submit: (course: CourseCombinedType) => Promise<void>;
    cancel: () => void;
  };
};

const CourseForm = ({ actions, course }: Props) => {
  const { data: semesters } = useGetSemestersQuery(undefined);

  const initialValues: CourseCreateType | CourseType = {
    id: (course as CourseType)?.id || 0,
    name: course?.name || "",
    code: course?.code || "",
    credit_units: course?.credit_units || 2,
    semester: course?.semester || "",
    type: course?.type || "",
    level_id: course?.level_id || 0,
    instructor_ids:
      (course?.instructors as InstructorType[])
        ?.map((ins) => ins.id)
        .filter((id) => id !== undefined) || [],
    instructors: (course?.instructors as InstructorType[]) || [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    code: Yup.string().required("Required"),
    credit_units: Yup.number().required("Required"),
    semester: Yup.string().required("Required"),
    level_id: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
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
      enableReinitialize={true}
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
              <label htmlFor="credit_units">Credit Unit</label>
              <Field id="credit_units" name="credit_units" type="number" />
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
                  {semesters?.data.map((option) => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <label htmlFor="instructor_ids">Assign Instructor(s)</label>
              <InstructorDropdown
                name="instructor_ids"
                label=""
                multiple
                value={values.instructors || []}
                onChange={(selectedInstructors) => {
                  const instructorIds = Array.isArray(selectedInstructors)
                    ? selectedInstructors.map((ins) => ins.id)
                    : [];
                  setFieldValue("instructor_ids", instructorIds);
                  setFieldValue("instructors", selectedInstructors || []);
                }}
                error={false}
                helperText=""
                required
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <label htmlFor="type">Course Type</label>
                <Select
                  sx={{
                    padding: 0,
                    ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                  }}
                  id="type"
                  name="type"
                  value={values.type}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    setFieldValue("type", value);
                  }}
                  input={<OutlinedInput />}
                >
                  {["Elective", "Core"].map((type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                      {type}
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
