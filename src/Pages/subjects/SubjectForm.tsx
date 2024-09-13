import * as Yup from "yup";
import { SubjectCreateType } from "../../types/subjects";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../components/form/form.module.scss";
import dayjs from "dayjs";

const CourseForm = () => {
  const initialValues: SubjectCreateType = {
    duration: "",
    end_date: dayjs(),
    instructors: [],
    name: "",
    phone: "",
    rank: "",
    start_date: dayjs(),
  };

  const validationSchema = Yup.object({
    duration: Yup.string().required("Required"),
    end_date: Yup.string().required("Required"),
    instructors: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    rank: Yup.string().required("Required"),
    start_date: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: SubjectCreateType) => {
    console.log(values);
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
            Add Subject
          </Typography>
          <Box>
            <label htmlFor="name">Subject Name</label>
            <Field id="name" name="name" />
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="rank">Rank Requirements</label>
              <Field id="rank" name="rank" />
            </Box>
            <Box>
              <label htmlFor="duration">Duration</label>
              <Field id="duration" name="duration" />
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
              <label htmlFor="duration">Duration</label>
              <Field id="duration" name="duration" />
            </Box>
            <Box>
              <label htmlFor="phone">Phone number</label>
              <Field id="phone" name="phone_number" />
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
              <label htmlFor="instructor">Instructor</label>
              <Field id="instructor" name="instructor" />
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <Box>
                <label htmlFor="start-date">Start date</label>
                <Field id="start-date" name="start_date" />
              </Box>
              <Box>
                <label htmlFor="end-date">End date</label>
                <Field id="end-date" name="end_date" />
              </Box>
            </Box>
          </Box>
          <Box className={formStyles.btn_group}>
            <Button className={formStyles.cancel_btn} variant="contained">
              Cancel
            </Button>
            <LoadingButton
              className={formStyles.submit_btn}
              type="submit"
              variant="contained"
              disabled={!(isValid && dirty)}
            >
              Add Subject
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CourseForm;
