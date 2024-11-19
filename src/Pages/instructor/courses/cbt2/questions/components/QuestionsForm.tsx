import {
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCreateQuestionFromFileMutation } from "../../../../../../store/api/quizzes.api";
import { useAddMediaMutation } from "../../../../../../store/api/media.api";
import { useAppDispatch } from "../../../../../../store/hooks";
import { setPageLoading } from "../../../../../../store/app.slice";
import ShareWithModal from "../../../../../../components/ShareWithModal";
import { useState } from "react";
import { useGetCourseParticipantsQuery } from "../../../../../../store/api/participants.api";
type FileType = { file: File | null };

type Props = {
  actions: {
    cancel: () => void;
  };
};

const QuestionsForm = ({ actions }: Props) => {
  const [addQuestionsFromFile, { isLoading: isAddingQuestions }] =
    useCreateQuestionFromFileMutation();
  const [uploadMedia, { isLoading: isUploadingMedia }] = useAddMediaMutation();
  const { assessment_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openShareModal, setOpenShareModal] = useState(false);
  const handleCloseShareModal = () => {
    setOpenShareModal(false);
  };

  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 4];
  const quizId = locationData[locationData.length - 2];
  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery(
      { course_id: parseInt(courseId) },
      { skip: !courseId }
    );

  if (!assessment_id) <Navigate to="/cbt" />;

  if (isFetchingParticipants) {
    return <LinearProgress />;
  }

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
      setOpenShareModal(true);
    } catch (error) {
      console.log(error);
    }
    dispatch(setPageLoading(false));
    // actions.cancel();
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
            <Box sx={{ width: "100%" }}>
              <Box>
                <label htmlFor="file">Upload Questions</label>
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
              <Button
                sx={{
                  border: "1px solid #FCC21B",
                  fontSize: ".8rem",
                  padding: ".8em",
                  fontWeight: 500,
                  backgroundColor: "#F0F9FF",
                  width: "100%",
                  marginTop: "1em",
                }}
                onClick={() => navigate("manual-input")}
              >
                Input Manually
              </Button>
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
              disabled={
                !(isValid && dirty) || isAddingQuestions || isUploadingMedia
              }
            >
              Upload
            </Button>
          </Box>
          <ShareWithModal
            open={openShareModal}
            handleClose={handleCloseShareModal}
            participants={participants?.data || []}
            quizId={parseInt(quizId)}
          />
        </Form>
      )}
    </Formik>
  );
};

export default QuestionsForm;
