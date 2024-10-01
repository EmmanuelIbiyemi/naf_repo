import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, SxProps, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../components/form/form.module.scss";
import { CBTQuestion } from "../../../types/subjects";

type Props = {
  question?: CBTQuestion;
  actions: {
    submit: (question: CBTQuestion) => void;
    cancel: () => void;
  };
};

type QuestionCreateType = {
  id?: number;
  question: string;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
};

const CBTQuestionForm = ({ actions, question }: Props) => {
  const initialValues: QuestionCreateType = {
    id: question?.id,
    answer: question?.answer || "",
    question: question?.question || "",
    option1: question?.options[0] || "",
    option2: question?.options[1] || "",
    option3: question?.options[2] || "",
    option4: question?.options[3] || "",
  };

  const validationSchema = Yup.object({
    question: Yup.string().required("Required"),
    answer: Yup.string().required("Required"),
    option1: Yup.string().required("Required"),
    option2: Yup.string().required("Required"),
    option3: Yup.string().required("Required"),
    option4: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: QuestionCreateType) => {
    const payload = {
      question: values.question,
      answer: values.answer,
      options: [values.option1, values.option2, values.option3, values.option4],
    };
    actions.submit(payload);
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
            sx={{ marginTop: ".6rem", textAlign: "center" }}
          >
            Input Manually
          </Typography>
          <Box sx={formGroup}>
            <label htmlFor="question">Add your question</label>
            <Field id="question" name="question" />
          </Box>
          <Box>
            <label htmlFor="option1">Option 1</label>
            <Field id="option1" name="option1" />
          </Box>
          <Box>
            <label htmlFor="option2">Option 2</label>
            <Field id="option2" name="option2" />
          </Box>
          <Box>
            <label htmlFor="option3">Option 3</label>
            <Field id="option3" name="option3" />
          </Box>
          <Box>
            <label htmlFor="option4">Option 4</label>
            <Field id="option4" name="option4" />
          </Box>
          <Box>
            <label htmlFor="answer">Answer</label>
            <Field id="answer" name="answer" />
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
              disabled={question ? !isValid : !(isValid && dirty)}
            >
              {question ? "Edit Subject" : "Add Subject"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CBTQuestionForm;

const formGroup: SxProps = {
  bgcolor: "#fff",
};
