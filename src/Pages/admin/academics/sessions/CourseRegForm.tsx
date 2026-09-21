import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CourseRegType } from "../../../../types/courses";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";
import { useGetCourseRegQuery } from "../../../../store/api/courses.api";

dayjs.extend(utc);

type Props = {
  actions: {
    submit: (course: CourseRegType) => Promise<void>;
    cancel: () => void;
  };
};

const CourseRegForm = ({ actions }: Props) => {
  const { data: courseRegData, isFetching } = useGetCourseRegQuery(null);

  const initialValues: CourseRegType = useMemo(() => {
    const start =
      courseRegData?.data?.start_date && dayjs(courseRegData.data.start_date).isValid()
        ? courseRegData.data.start_date
        : "";
    const end =
      courseRegData?.data?.end_date && dayjs(courseRegData.data.end_date).isValid()
        ? courseRegData.data.end_date
        : "";
    return {
      start_date: start,
      end_date: end,
    };
  }, [courseRegData]);

  const validationSchema = Yup.object({
    start_date: Yup.string().required("Required"),
    end_date: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: CourseRegType) => {
    await actions.submit(values);
  };

  const toLocalPickerValue = (value?: string) => {
    if (!value) return null;
    const parsed = dayjs.utc(value);
    if (!parsed.isValid()) return null;
    return parsed.local();
  };

  const toUtcString = (value: dayjs.Dayjs | null) =>
    value ? value.utc().toISOString() : "";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isValid, dirty, setFieldValue, values }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            Manage Course Registration
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
              marginTop: "1rem",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box>
                <label htmlFor="start_date">Start Date</label>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  value={toLocalPickerValue(values.start_date)}
                  onChange={(value) => setFieldValue("start_date", toUtcString(value))}
                  disabled={isFetching}
                />
              </Box>
              <Box>
                <label htmlFor="end_date">End Date</label>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  value={toLocalPickerValue(values.end_date)}
                  onChange={(value) => setFieldValue("end_date", toUtcString(value))}
                  disabled={isFetching}
                />
              </Box>
            </LocalizationProvider>
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
              Update Course Reg
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CourseRegForm;
