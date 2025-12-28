import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { ChangeEvent, useEffect, useState } from "react";
import { EligibleCreateType } from "../../../../types/eligibles";
import { useGetLevelsMMutation } from "../../../../store/api/levels.api";
import { useAddMediaMutation } from "../../../../store/api/media.api";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageLoading } from "../../../../store/app.slice";
import SessionDropdown from "../../../../components/SessionDropdown";
import { TEMPLATE_FILES } from "../../../../config/templates";

type Props = {
  actions: {
    submit: (eligible: EligibleCreateType) => Promise<void>;
    cancel: () => void;
  };
};

const EligibleForm = ({ actions }: Props) => {
  const { data: faculties } = useGetFacultiesQuery({ per_page: 10, page: 1 });
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [getLevels, levelsState] = useGetLevelsMMutation();
  const [uploadFile, uploadState] = useAddMediaMutation();
  const dispatch = useAppDispatch();
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const initialValues: EligibleCreateType & {
    faculty_id: number;
    department_id: number;
  } = {
    department_id: 0,
    faculty_id: 0,
    level_id: 0,
    list_url: "",
    session: "",
    program_id: 0,
  };

  const validationSchema = Yup.object({
    session: Yup.string().required("session is required"),
    level_id: Yup.number().required("Level is required"),
    program_id: Yup.number().required("Program ID is required"),
    list_url: Yup.string().required("File is required"),
  });

  const handleSubmit = async (values: EligibleCreateType) => {
    await actions.submit(values);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: number | string,
      shouldValidate?: boolean
    ) => void
  ) => {
    const { target } = e;

    if (target.name == "session") setFieldValue(target.name, target.value);
    else setFieldValue(target.name, +target.value);

    try {
      if (target.name === "faculty_id") {
        await getDepartments({
          faculty_id: +target.value,
          page: 1,
          per_page: 1000,
        }).unwrap();
      } else if (target.name === "department_id") {
        await getPrograms({
          department_id: +target.value,
          page: 1,
          per_page: 1000,
        }).unwrap();
      } else if (target.name === "program_id") {
        await getLevels({
          program_id: +target.value,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = async (
    ev: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean
    ) => void
  ) => {
    try {
      if (ev.target.files?.[0]) {
        const form = new FormData();
        form.append("file", ev.target.files[0]);
        const response = await uploadFile(form).unwrap();
        setFieldValue("list_url", response.media[0].url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      departmentsState.isLoading ||
      programsState.isLoading ||
      levelsState.isLoading
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [departmentsState, programsState, levelsState]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, errors, setFieldValue, touched }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            Add Eligibles
          </Typography>
          <Box>
            <label htmlFor="faculty">Faculty</label>
            <Field
              id="faculty"
              name="faculty_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                handleChange(ev, setFieldValue)
              }
            >
              <option value="">select faculty</option>
              {faculties?.data.map((fac) => (
                <option key={fac.name} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </Field>
            {errors.faculty_id && touched.faculty_id && (
              <div>{errors.faculty_id}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="department">Department</label>
            <Field
              id="department"
              name="department_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                handleChange(ev, setFieldValue)
              }
            >
              <option value="">select department</option>
              {departmentsState.data?.data.map((dep, i) => (
                <option key={dep.name + i} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </Field>
            {errors.department_id && touched.department_id && (
              <div>{errors.department_id}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="program">Program</label>
            <Field
              id="program"
              name="program_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                handleChange(ev, setFieldValue)
              }
            >
              <option value="">select program</option>
              {programsState.data?.data.map((dep, i) => (
                <option key={dep.name + i} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </Field>
            {errors.program_id && touched.program_id && (
              <div>{errors.program_id}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="level">Level</label>
            <Field
              id="level"
              name="level_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                handleChange(ev, setFieldValue)
              }
            >
              <option value="">select level</option>
              {levelsState.data?.data.map((lvl, i) => (
                <option key={lvl.name + i} value={lvl.id}>
                  {lvl.name}
                </option>
              ))}
            </Field>
            {errors.level_id && touched.level_id && (
              <div>{errors.level_id}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="session">Session</label>
            <SessionDropdown
              name="session"
              label=""
              value={selectedSession}
              onChange={(session) => {
                setSelectedSession(session);
                setFieldValue("session", session?.name || "");
              }}
              error={Boolean(errors.session && touched.session)}
              helperText={
                errors.session && touched.session ? String(errors.session) : ""
              }
              required
            />
          </Box>
          <Box>
            <label htmlFor="file">Upload List</label>
            <input
              id="file"
              type="file"
              onChange={(ev) => handleFileUpload(ev, setFieldValue)}
            />
            {errors.list_url && touched.list_url && (
              <div>{errors.list_url}</div>
            )}
            <Typography>
              {uploadState.isLoading ? "Uploading" : null}
            </Typography>
            <a
              style={{
                display: "block",
                color: "steelblue",
                marginTop: ".5rem",
                textDecoration: "underline",
              }}
              href={TEMPLATE_FILES.SAMPLE_ELIGIBLES_FILE}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              download example file
            </a>
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
              Upload Eligibles
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EligibleForm;
