import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { useCreateQuestionFromFileMutation } from "../../../../../store/api/quizzes.api";
import { useAddMediaMutation } from "../../../../../store/api/media.api";
import { Navigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../../store/hooks";
import { setPageLoading } from "../../../../../store/app.slice";
import { TEMPLATE_FILES } from "../../../../../config/templates";

type FileType = { file: File | null };

type Props = {
  actions: {
    cancel: () => void;
  };
};

const QuestionsForm = ({ actions }: Props) => {
  const [addQuestionsFromFile] = useCreateQuestionFromFileMutation();
  const [uploadMedia] = useAddMediaMutation();
  const { assessment_id } = useParams();
  const dispatch = useAppDispatch();

  if (!assessment_id) <Navigate to="/cbt" />;

  const initialValues: FileType = {
    file: null,
  };

  const validationSchema = Yup.object().shape({
    file: Yup.string().required("File is required"),
  });

  const handleSubmit = async ({ file }: FileType) => {
    dispatch(setPageLoading(true));
    const form = new FormData();
    if (file) {
      form.append("file", file);
    } else {
      console.error("File not found in payload");
      return;
    }
    try {
      const mediaResponse = await uploadMedia(form).unwrap();
      await addQuestionsFromFile({
        assessment_id: +(assessment_id || 0) as number,
        file_url: mediaResponse.media[0].url,
      }).unwrap();
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
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            Add Questions
          </Typography>
          <Box sx={{ marginTop: "1em" }}>
            <Box>
              <label
                htmlFor="file"
                style={{ marginBottom: ".5rem", display: "block" }}
              >
                Upload Questions
              </label>
              <Field name="file">
                {({ form, meta }: FieldProps) => (
                  <TextField
                    type="file"
                    fullWidth
                    error={!!meta.error && meta.touched}
                    helperText={meta.touched && meta.error}
                    onChange={(ev) => {
                      const file = (ev.currentTarget as HTMLInputElement)
                        .files?.[0];
                      form.setFieldValue("file", file || null);
                    }}
                  />
                )}
              </Field>
            </Box>
            <a
              style={{
                display: "block",
                color: "steelblue",
                marginTop: ".5rem",
                textDecoration: "underline",
              }}
              href={TEMPLATE_FILES.SAMPLE_QUESTIONS_FILE}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              download example file
            </a>
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
              Upload
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default QuestionsForm;
