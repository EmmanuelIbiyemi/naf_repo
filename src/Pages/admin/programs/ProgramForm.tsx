import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../components/form/form.module.scss";
import { ProgramCreateType, ProgramType } from "../../../types/programs";
import { useGetProgramsQuery } from "../../../store/api/programs.api";

type Props = {
  program?: ProgramType;
  actions: {
    submit: (program: ProgramType) => Promise<void>;
    cancel: () => void;
  };
};

const ProgramForm = ({ actions, program }: Props) => {
  const { data: programs } = useGetProgramsQuery(null);

  const initialValues: ProgramCreateType | ProgramType = {
    id: program?.id || 0,
    name: program?.name || "",
    next_program_id: program?.next_program_id || null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: ProgramType) => {
    if (values.id == 0) delete values.id;
    await actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, values, setFieldValue }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {program ? "Update Program" : "Add Program"}
          </Typography>
          <Box>
            <label htmlFor="name">Program Name</label>
            <Field id="name" name="name" />
          </Box>

          <Box>
            <Box>
              <FormControl fullWidth>
                <label htmlFor="next_program_id">Choose Next Program</label>
                <Select
                  sx={{
                    padding: 0,
                    ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                  }}
                  id="next_program_id"
                  name="next_program_id"
                  value={values?.next_program_id || 0}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    setFieldValue("next_program_id", value);
                  }}
                  input={<OutlinedInput />}
                >
                  <MenuItem value={0}>Select Program</MenuItem>
                  {programs?.data
                    .filter((p) => p.id !== program?.id)
                    .map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
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
              {program ? "Update Program" : "Add Program"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProgramForm;
