import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../components/form/form.module.scss";
import { CourseCombinedType, CourseType } from "../../types/courses";

type Props = {
  course?: CourseType;
  actions: {
    submit: (course: CourseCombinedType) => void;
    cancel: () => void;
  };
};

const CourseForm = ({ actions, course }: Props) => {
  const initialValues = {
    id: course?.id,
    name: course ? course.name : "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: CourseCombinedType) => {
    if (course) console.log("edit");
    else console.log("add");
    actions.submit(values);
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
            Create New Course
          </Typography>
          <Box sx={{ marginTop: "1rem" }}>
            <label htmlFor="name">Course Name</label>
            <Field id="name" name="name" as="textarea" />
          </Box>
          <Box className={formStyles.btn_group}>
            <Button
              onClick={actions.cancel}
              className={formStyles.cancel_btn}
              variant="contained"
            >
              Cancel
            </Button>
            <LoadingButton
              className={formStyles.submit_btn}
              type="submit"
              variant="contained"
              disabled={course ? !isValid : !(isValid && dirty)}
            >
              {course ? "Edit Course" : "Add Course"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CourseForm;
