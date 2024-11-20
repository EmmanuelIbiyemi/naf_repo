import {
  Box,
  Button,
  FormControl,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetFormQuery,
  useUpdateFormMutation,
} from "../../../../store/api/form.api";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageLoading } from "../../../../store/app.slice";

type FormProps = {
  name: string;
  button: string;
  fee: number;
};

const PropertiesSideBar = () => {
  const navigate = useNavigate();
  const { form_id } = useParams();
  const { data: frm } = useGetFormQuery(+(form_id || 0));
  const [props, setProps] = useState<FormProps>({
    name: frm?.data.name.split("::")[0] || "",
    button: frm?.data.name.split("::")[1] || "",
    fee: frm?.data.fee || 0,
  });
  const [updateForm] = useUpdateFormMutation();
  const dispatch = useAppDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    console.log(name);

    setProps((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handlePreviewForm = () => {
    navigate(`/form/${form_id}/preview`);
  };

  const handleSaveForm = async () => {
    dispatch(setPageLoading(true));
    try {
      if (frm?.data)
        await updateForm({
          ...frm?.data,
          name: `${props.name}::${props.button}`,
          fee: props.fee,
        }).unwrap();
    } catch (error) {
      console.log(error);
    }
    dispatch(setPageLoading(false));
  };

  useEffect(() => {
    setProps({
      name: frm?.data.name.split("::")[0] || "",
      button: frm?.data.name.split("::")[0] || "",
      fee: frm?.data.fee || 0,
    });
  }, [frm]);

  return (
    <Box sx={propertiesSidebarStyles}>
      <Box>
        <Typography variant="h5">Properties</Typography>
        <Box>
          <Typography sx={{ marginBlock: "1.5rem .5rem" }}>
            Form Name
          </Typography>
          <Box sx={{ ...groupStyles, gap: "1rem" }}>
            <FormControl fullWidth>
              <TextField
                placeholder={"enter name..."}
                value={props?.name.split("::")[0]}
                name="name"
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ marginBlock: "1.5rem .5rem" }}>
            Submit button
          </Typography>
          <Box sx={{ ...groupStyles, gap: "1rem" }}>
            <FormControl fullWidth>
              <TextField
                placeholder={"enter button text..."}
                value={props?.button.split("::")[1]}
                name="button"
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ marginBlock: "1.5rem .5rem" }}>Fee</Typography>
          <Box sx={{ ...groupStyles, gap: "1rem" }}>
            <FormControl fullWidth>
              <TextField
                type="number"
                value={props?.fee?.toLocaleString()}
                name="fee"
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "grid", gap: "1rem" }}>
        <Button variant="contained" onClick={() => handlePreviewForm()}>
          Preview
        </Button>
        <Button variant="contained" onClick={() => handleSaveForm()}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default PropertiesSideBar;

const propertiesSidebarStyles: SxProps = {
  alignContent: "space-between",
  borderLeft: "1px solid rgba(229, 229, 229, 1)",
  bgcolor: "rgba(249, 250, 251, 1)",
  display: "grid",
  height: "100vh",
  overflow: "auto",
  padding: "1rem var(--padding)",
  position: "sticky",
  top: 0,

  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const groupStyles: SxProps = {
  button: {
    bgcolor: "#fff",
    color: "inherit",
    height: "35px",
    minWidth: 0,
    padding: 0,
    width: "45px",
  },
  ".MuiOutlinedInput-root input": {
    bgcolor: "#fff",
    paddingBlock: "8px",
  },
};
