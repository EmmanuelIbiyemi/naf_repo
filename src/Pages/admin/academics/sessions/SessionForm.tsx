import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import {
  SessionCombinedType,
  SessionCreateType,
  SessionType,
} from "../../../../types/sessions";
import dayjs from "dayjs";

type Props = {
  session?: SessionCombinedType;
  actions: {
    submit: (session: SessionCombinedType) => Promise<void>;
    cancel: () => void;
  };
};

const SessionForm = ({ actions, session }: Props) => {
  const initialValues: SessionCreateType | SessionType = {
    id: (session as SessionType)?.id || 0,
    name: session?.name || "",
    end_date: session?.end_date
      ? dayjs(session.end_date).format("YYYY-MM-DD")
      : "",
    start_date: session?.start_date
      ? dayjs(session.start_date).format("YYYY-MM-DD")
      : "",
    semesters: session?.semesters || [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    start_date: Yup.string().required("Required"),
    end_date: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: SessionCombinedType) => {
    await actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isValid, dirty }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {session ? "Update Session" : "Add Session"}
          </Typography>

          <Box>
            <label htmlFor="name">Session Name</label>
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
              <label htmlFor="start_date">Start Date</label>
              <Field id="start_date" name="start_date" type="date" />
            </Box>
            <Box>
              <label htmlFor="end_date">End Date</label>
              <Field id="end_date" name="end_date" type="date" />
            </Box>
          </Box>

          <Box className={formStyles.btn_group}>
            <Button
              onClick={() => actions.cancel()}
              className={formStyles.cancel_btn}
              variant="contained"
            >
              Cancel
            </Button>
            <LoadingButton
              className={formStyles.submit_btn}
              type="submit"
              variant="contained"
              disabled={!(isValid && dirty)}
            >
              {session ? "Update Session" : "Add Session"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SessionForm;
