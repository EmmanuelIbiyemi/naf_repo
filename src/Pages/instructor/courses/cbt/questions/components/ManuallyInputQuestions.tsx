import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Pagination,
  Grid2,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useCreateQuestionManuallyMutation } from "../../../../../../store/api/quizzes.api";
import ShareWithModal from "../../../../../../components/ShareWithModal";
import { useGetCourseParticipantsQuery } from "../../../../../../store/api/participants.api";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../../../store/app.slice";

interface TestQuestion {
  question: string;
  options: string[];
}

interface FormValues {
  questions: TestQuestion[];
}

interface TransformedQuestion {
  body: string;
  options: {
    body: string;
    is_answer: boolean;
  }[];
}

interface UploadPayload {
  questions: TransformedQuestion[];
  assessment_id: number;
}

interface QuestionFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder: string;
}

const validationSchema = Yup.object().shape({
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        options: Yup.array()
          .of(Yup.string().required("Option is required"))
          .length(4, "Must have exactly 4 options"),
      })
    )
    .min(1, "At least one question is required"),
});

const QuestionField: React.FC<QuestionFieldProps> = ({
  label,
  value,
  onChange,
  error,
  touched,
  placeholder,
}) => (
  <Box>
    <Typography variant="subtitle1" gutterBottom>
      {label}
    </Typography>
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={touched && !!error}
      helperText={touched && error}
      sx={{
        backgroundColor: "#F8FAFC",
        border: "1px solid #CCCCCC",
        borderRadius: "10px",
      }}
    />
  </Box>
);

const ManualInputQuestions: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const questionsPerPage = 9;
  const { assessment_id } = useParams();
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const handleCloseShareModal = () => {
    setOpenShareModal(false);
  };

  if (!assessment_id) <Navigate to="/cbt" />;

  const initialValues: FormValues = {
    questions: [{ question: "", options: ["", "", "", ""] }],
  };

  const [uploadQuestions, { isLoading }] = useCreateQuestionManuallyMutation();
  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 5];
  const quizId = locationData[locationData.length - 3];
  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery(
      { course_id: parseInt(courseId) },
      { skip: !courseId }
    );

  React.useEffect(() => {
    if (isFetchingParticipants) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isFetchingParticipants, dispatch]);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const transformedQuestions: TransformedQuestion[] = values.questions.map(
        (question) => ({
          body: question.question,
          options: question.options.map((option, index) => ({
            body: option,
            is_answer: index === 0,
          })),
        })
      );

      const uploadPayload: UploadPayload = {
        questions: transformedQuestions,
        assessment_id: +(assessment_id || 0) as number,
      };

      await uploadQuestions(uploadPayload).unwrap();
      setOpenShareModal(true);
    } catch (error) {
      console.error("Error submitting questions:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange }) => {
          const indexOfLastQuestion = currentPage * questionsPerPage;
          const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
          const currentQuestions = values.questions.slice(
            indexOfFirstQuestion,
            indexOfLastQuestion
          );

          return (
            <Form>
              <Box sx={{ margin: "auto", padding: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      Input Questions Manually
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#CCCCCC",
                        borderRadius: "6px",
                        width: "11em",
                      }}
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        borderRadius: "6px",
                        width: "11em",
                      }}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                </Box>

                {typeof errors.questions === "string" && (
                  <Alert severity="error" sx={{ my: 2 }}>
                    {errors.questions}
                  </Alert>
                )}

                <FieldArray name="questions">
                  {({ push, remove }) => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mb: 2,
                        }}
                      >
                        <Button
                          startIcon={<AddCircleOutlineIcon />}
                          variant="contained"
                          onClick={() =>
                            push({ question: "", options: ["", "", "", ""] })
                          }
                          sx={{ borderRadius: "6px" }}
                        >
                          Add Question
                        </Button>
                      </Box>

                      <Grid2 container spacing={2}>
                        {currentQuestions.map((_, questionIndex) => {
                          const actualIndex =
                            indexOfFirstQuestion + questionIndex;
                          const questionErrors = errors.questions?.[
                            actualIndex
                          ] as
                            | {
                                question?: string;
                                options?: string[];
                              }
                            | undefined;
                          // const questionTouched = touched.questions?.[actualIndex];

                          return (
                            <Grid2 size={5} key={actualIndex}>
                              <Box
                                sx={{
                                  backgroundColor: "#fff",
                                  borderRadius: "10px",
                                  padding: "1em",
                                  position: "relative",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                  }}
                                >
                                  <Typography variant="h6">
                                    Question {actualIndex + 1}
                                  </Typography>
                                  <IconButton
                                    onClick={() => remove(actualIndex)}
                                    color="error"
                                    size="small"
                                    disabled={values.questions.length === 1}
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                </Box>

                                <QuestionField
                                  label="Question"
                                  value={values.questions[actualIndex].question}
                                  onChange={handleChange(
                                    `questions.${actualIndex}.question`
                                  )}
                                  error={questionErrors?.question}
                                  // touched={questionTouched?.question}
                                  placeholder="Type a question here"
                                />

                                <Grid2 container spacing={2} sx={{ mt: 2 }}>
                                  {values.questions[actualIndex].options.map(
                                    (_, optionIndex) => (
                                      <Grid2 size={6} key={optionIndex}>
                                        <QuestionField
                                          label={
                                            optionIndex === 0
                                              ? "Answer"
                                              : `Option`
                                          }
                                          value={
                                            values.questions[actualIndex]
                                              .options[optionIndex]
                                          }
                                          onChange={handleChange(
                                            `questions.${actualIndex}.options.${optionIndex}`
                                          )}
                                          error={
                                            questionErrors?.options?.[
                                              optionIndex
                                            ]
                                          }
                                          //   touched={questionTouched?.options?.[optionIndex]}
                                          placeholder={
                                            optionIndex === 0
                                              ? "Type your answer here"
                                              : `Type option ${optionIndex} here`
                                          }
                                        />
                                      </Grid2>
                                    )
                                  )}
                                </Grid2>
                              </Box>
                            </Grid2>
                          );
                        })}
                      </Grid2>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginY: 2,
                        }}
                      >
                        <Pagination
                          count={Math.ceil(
                            values.questions.length / questionsPerPage
                          )}
                          page={currentPage}
                          onChange={(_event, value) => setCurrentPage(value)}
                        />
                      </Box>
                      <ShareWithModal
                        open={openShareModal}
                        handleClose={handleCloseShareModal}
                        participants={participants?.data || []}
                        quizId={parseInt(quizId)}
                      />
                    </>
                  )}
                </FieldArray>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ManualInputQuestions;
