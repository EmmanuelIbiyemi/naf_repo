import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../components/form/form.module.scss";
import {
  ParticipantCombinedType,
  ParticipantType,
} from "../../types/participants";

type Props = {
  participant?: ParticipantType;
  actions: {
    submit: (course: ParticipantCombinedType) => void;
    cancel: () => void;
  };
};

const ParticipantForm = ({ actions, participant }: Props) => {
  const initialValues = {
    id: participant?.id,
    first_name: participant ? participant.first_name : "",
    last_name: participant ? participant.last_name : "",
    courses: participant ? participant.courses : "",
    email: participant ? participant.email : "",
    password: participant ? participant.password : "",
    phone_number: participant ? participant.phone_number : "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    courses: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    phone_number: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: ParticipantCombinedType) => {
    if (participant) console.log("edit");
    else console.log("add");
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
            Invite Participants
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="name">First Name</label>
              <Field id="name" name="first_name" />
            </Box>
            <Box>
              <label htmlFor="last-name">Last Name</label>
              <Field id="last-name" name="last_name" />
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
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" />
            </Box>
            <Box>
              <label htmlFor="phone-number">Phone Number</label>
              <Field id="phone-number" name="phone_number" placeholder="+234" />
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
              <label htmlFor="courses">Assign Course(s) (optional)</label>
              <Field id="courses" name="courses" placeholder="select courses" />
            </Box>
            <Box>
              <label htmlFor="password">Create Password</label>
              <Field
                id="password"
                name="password"
                placeholder="Set default password for user"
              />
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
              Add Subject
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ParticipantForm;
