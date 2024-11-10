import { Box, Button, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Step1Content from "./Step1Content";
import { CreateQuiz2 } from "../../../../types/quizzes";
import {
  useAddQuizMutation,
  useCreateQuestionFromFileMutation,
} from "../../../../store/api/quizzes.api";
import { useAddMediaMutation } from "../../../../store/api/media.api";

type Props = {
  actions: {
    cancel: () => void;
  };
};

const CBTForm = ({ actions }: Props) => {
  const [addQuiz] = useAddQuizMutation();
  const [addQuestionsFromFile] = useCreateQuestionFromFileMutation();
  const [uploadMedia] = useAddMediaMutation();

  const initialValues: CreateQuiz2 = {
    name: "",
    obtainable_score: 100,
    start_date: "",
    expiry_date: "",
    type: "graded",
    show_result: false,
    instructions: "",
    time_allowed: 30,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Type date is required"),
    instructions: Yup.string().required("Instructions date is required"),
    start_date: Yup.string().required("Start date is required"),
    expiry_date: Yup.string().required("Expiry date is required"),
    questions: Yup.mixed().required("Questions are required"),
    time_allowed: Yup.number()
      .min(1)
      .max(100)
      .required("Time allowed date is required"),
    obtainable_score: Yup.number()
      .min(1)
      .max(100)
      .required("Passing Percentage is required"),
  });

  const handleSubmit = async (quiz: CreateQuiz2 & { questions?: File }) => {
    const payload = { ...quiz };
    const questionsFile = payload.questions;
    delete payload.questions;
    console.log(questionsFile);

    const form = new FormData();
    if (questionsFile) {
      form.append("file", questionsFile as File);
    } else {
      console.error("File not found in payload");
      return;
    }
    try {
      const mediaResponse = await uploadMedia(form).unwrap();
      const response = await addQuiz(quiz).unwrap();
      await addQuestionsFromFile({
        assessment_id: response.data.id,
        file_url: mediaResponse.media[0].url,
      }).unwrap();
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
      {({ isValid, dirty }) => (
        <Form style={{ width: "100%" }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            Add Quiz
          </Typography>
          <Box sx={{ marginTop: "1em" }}>
            <Step1Content />
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
              Create Quiz
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CBTForm;
