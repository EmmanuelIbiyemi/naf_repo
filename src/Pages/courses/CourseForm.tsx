import * as Yup from "yup";
import { CourseCreateType } from "../../types/courses";
import { Field, Form, Formik } from "formik";
import { Box, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// import { useNavigate } from "react-router-dom";
import formStyles from "../../components/form/form.module.scss";

const CourseForm = () => {
  //   const navigate = useNavigate();
  const initialValues = {
    name: "",
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: CourseCreateType) => {
    console.log(values);
    // navigate("/");
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={formStyles.modal_form}>
        <Box>
          <label htmlFor="name">Course Name</label>
          <Field id="name" name="name" as="textarea" />
        </Box>
        <Box className={formStyles.btn_group}>
          <Button className={formStyles.cancel_btn} variant="contained">
            Cancel
          </Button>
          <LoadingButton
            className={formStyles.submit_btn}
            type="submit"
            variant="contained"
          >
            Add Course
          </LoadingButton>
        </Box>
      </Form>
    </Formik>
  );
};

export default CourseForm;
