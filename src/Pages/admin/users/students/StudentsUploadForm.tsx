import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { StudentsUploadType } from "../../../../types/students";
import { ChangeEvent } from "react";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useGetLevelsMMutation } from "../../../../store/api/levels.api";
import { useAddMediaMutation } from "../../../../store/api/media.api";

type Props = {
    data?: StudentsUploadType;
    actions: {
      submit: (data: StudentsUploadType) => Promise<void>;
      cancel: () => void;
    };
  };
  

const StudentUploadForm = ({ actions }: Props) => {
  const { data: faculties } = useGetFacultiesQuery({
    page: 1,
    per_page: 1000,
  });
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [getLevels, levelsState] = useGetLevelsMMutation();
  const [uploadFile, uploadState] = useAddMediaMutation();

  const initialValues: StudentsUploadType = {
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
    level_id: 0,
    list_url: "",
    promotion: false,
  };

  const validationSchema = Yup.object({
    level_id: Yup.number().required("Level is required"),
    list_url: Yup.string().required("A file is required"), // Add validation for the file
  });

  const handleSubmit = async (values: StudentsUploadType) => {
    const formattedValues = {
      ...values,
    };

    await actions.submit(formattedValues);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: number,
      shouldValidate?: boolean
    ) => void
  ) => {
    const { target } = e;

    setFieldValue(target.name, +target.value);
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, errors, touched, setFieldValue }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {"Upload Students"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
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
              <label htmlFor="programme">Programme</label>
              <Field
                id="programme"
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
                <option value="">select programme</option>
                {programsState.data?.data.map((pro) => (
                  <option key={pro.name} value={pro.id}>
                    {pro.name}
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
              >
                <option value="">select level</option>
                {levelsState.data?.data.map((pro) => (
                  <option key={pro.name} value={pro.id}>
                    {pro.name}
                  </option>
                ))}
              </Field>
              {errors.level_id && touched.level_id && (
                <div>{errors.level_id}</div>
              )}
            </Box>
            <Box>
            <label htmlFor="file">Upload List</label>
            <input
              id="file"
              type="file"
              onChange={(ev) => handleFileUpload(ev, setFieldValue)}
            />
            <Box sx={{ marginTop: '.5rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <Field type="checkbox" name="promotion" style={{ width: 16, height: 16, marginRight: 4 }} />
                <span style={{ fontSize: '0.95rem' }}>Promotion list (move existing students to this level)</span>
              </label>
            </Box>
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
              href={import.meta.env.VITE_SAMPLE_STUDENTS_FILE}
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
                size="small"
                sx={{ fontSize: '0.95rem', padding: '4px 16px', minWidth: 0 }}
              >
                Cancel
              </Button>
              <LoadingButton
                className={formStyles.submit_btn}
                type="submit"
                variant="contained"
                size="small"
                sx={{ fontSize: '0.95rem', padding: '4px 16px', minWidth: 0 }}
                disabled={!(isValid && dirty)}
              >
                {"Upload Students"}
              </LoadingButton>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default StudentUploadForm;
