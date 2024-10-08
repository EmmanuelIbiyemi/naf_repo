import * as Yup from "yup";
import {
  SubjectCombinedType,
  SubjectCreateType,
  SubjectType,
} from "../../../types/subjects";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../components/form/form.module.scss";
import dayjs from "dayjs";
import { instructors } from "../instructors/instructors-data";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Props = {
  subject?: SubjectType;
  actions: {
    submit: (subject: SubjectCombinedType) => void;
    cancel: () => void;
  };
};

const SubjectForm = ({ actions, subject }: Props) => {
  const initialValues: SubjectCreateType = {
    duration: subject?.duration || "",
    end_date: subject?.end_date || dayjs(),
    instructors: subject?.instructors || [],
    name: subject?.name || "",
    phone: subject?.phone || "",
    rank: subject?.rank || "",
    start_date: subject?.start_date || dayjs(),
  };

  const validationSchema = Yup.object({
    duration: Yup.string().required("Required"),
    end_date: Yup.string().required("Required"),
    instructors: Yup.array()
      .min(1, "Please select at least one instructor")
      .required("Required"),
    name: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    rank: Yup.string().required("Required"),
    start_date: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: SubjectCreateType) => {
    if (subject) console.log("edit");
    else console.log("add");
    actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, values, setFieldValue }) => {
        return (
          <Form className={formStyles.modal_form}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginTop: "1rem", textAlign: "center" }}
            >
              Add Subject
            </Typography>
            <Box>
              <label htmlFor="name">Subject Name</label>
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
                <label htmlFor="rank">Rank Requirements</label>
                <Field id="rank" name="rank" />
              </Box>
              <Box>
                <label htmlFor="duration">Duration</label>
                <Field id="duration" name="duration" />
              </Box>
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "1fr 1fr",

                ".MuiFormControl-root": { width: "100%" },
                ".MuiInputBase-input": {
                  border: 0,
                  height: "10px",
                  width: "100%",
                },
              }}
            >
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <label htmlFor="start-date">Start date</label>
                  <DatePicker
                    value={values.start_date}
                    onChange={(date) => {
                      setFieldValue("start_date", date);
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <label htmlFor="end-date">End date</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={values.end_date}
                    onChange={(date) => {
                      setFieldValue("end_date", date);
                    }}
                  />
                </LocalizationProvider>
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
                <FormControl fullWidth>
                  <label htmlFor="instructors">Instructors</label>
                  <Select
                    sx={{
                      padding: 0,
                      ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                    }}
                    multiple
                    name="instructors"
                    value={values.instructors.map(
                      (instructor) => instructor.id
                    )}
                    onChange={(event) => {
                      const {
                        target: { value },
                      } = event;
                      const selectedIds = value as number[];
                      const foundInstructors = instructors.filter(
                        (instructor) =>
                          selectedIds.includes(instructor.id as number)
                      );
                      setFieldValue("instructors", foundInstructors);
                    }}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => {
                          const instructor = instructors.find(
                            (inst) => inst.id === id
                          );
                          return (
                            instructor && (
                              <Chip
                                key={`instructor-chip-${instructor.id}`}
                                label={
                                  instructor.first_name +
                                  " " +
                                  instructor.last_name
                                }
                              />
                            )
                          );
                        })}
                      </Box>
                    )}
                  >
                    {instructors.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.first_name + " " + option.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <label htmlFor="phone">Phone number</label>
                <Field id="phone" name="phone" />
              </Box>
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
                disabled={!(isValid && dirty)}
              >
                {subject ? "Edit Subject" : "Add Subject"}
              </LoadingButton>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SubjectForm;
