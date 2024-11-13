import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { useCreateAssessmentMutation } from "../../../../../store/api/quizzes.api";
import { Navigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../../store/hooks";
import { setPageLoading } from "../../../../../store/app.slice";

type Payload = { quiz_id: number; name: string };

type Props = {
  actions: {
    cancel: () => void;
  };
};

const QuestionsForm = ({ actions }: Props) => {
  const { quiz_id, assessment_id } = useParams();
  const [addAssessment] = useCreateAssessmentMutation();
  const dispatch = useAppDispatch();

  if (!assessment_id) <Navigate to="/cbt" />;

  const initialValues: Payload = {
    quiz_id: +(quiz_id || 0),
    name: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = async (assessment: Payload) => {
    dispatch(setPageLoading(true));
    try {
      await addAssessment(assessment).unwrap();
    } catch (error) {
      console.log(error);
    }
    dispatch(setPageLoading(false));
    actions.cancel();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form style={{ width: "100%" }}>
          <Box
            sx={{ ">div,label": { display: "block", marginBottom: ".5rem" } }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginTop: "1rem", textAlign: "center" }}
            >
              Assessment
            </Typography>
            <Box sx={{ marginTop: "1em" }}>
              <Box sx={{ marginBottom: ".5rem" }}>
                <label htmlFor="name">Name</label>
                <Field name="name">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      fullWidth
                      error={!!meta.error && meta.touched}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              button: { padding: ".4rem 2rem", width: "100%" },
              marginTop: "1em",
            }}
          >
            <Button
              sx={{
                bgcolor: "transparent",
                border: "1px solid rgba(138, 138, 138, 1)",
                color: "rgba(138, 138, 138, 1)",
              }}
              variant="contained"
              type="button"
              onClick={actions.cancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!(isValid && dirty)}
            >
              Create Assessment
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default QuestionsForm;
