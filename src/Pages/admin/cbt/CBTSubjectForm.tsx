import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../components/form/form.module.scss";
import { CBTSubjectType } from "../../../types/subjects";

type Props = {
  subject?: CBTSubjectType;
  actions: {
    submit: (subject: CBTSubjectType) => void;
    cancel: () => void;
  };
};

const CBTSubjectForm = ({ actions, subject }: Props) => {
  const initialValues: CBTSubjectType = {
    id: subject?.id,
    name: subject ? subject.name : "",
    questions: [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: CBTSubjectType) => {
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
            Add Subject
          </Typography>
          <Box sx={{ marginTop: "1rem" }}>
            <label htmlFor="name">Subject Name</label>
            <Field id="name" name="name" />
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
              disabled={subject ? !isValid : !(isValid && dirty)}
            >
              {subject ? "Edit Subject" : "Add Subject"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CBTSubjectForm;
