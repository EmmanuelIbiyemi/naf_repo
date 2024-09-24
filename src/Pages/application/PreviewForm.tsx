import {
  Box,
  Button,
  InputLabel,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PreviewFormPage = () => {
  const [props] = useState({
    formName: "Untitled Form",
    submitBtn: "Submit Form",
  });

  const navigate = useNavigate();

  return (
    <Box sx={formContentContainerStyles}>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              id="formName"
              dangerouslySetInnerHTML={{ __html: props.formName }}
            />
          </Typography>
        </Box>
        <Box sx={dropAreaStyles}>
          <Box>
            <Typography variant="h6">Heading</Typography>
            <Typography>Sub Heading</Typography>
          </Box>
          <Box>
            <InputLabel>
              <Typography variant="h6">Type a question</Typography>
            </InputLabel>
            <TextField multiline fullWidth rows={5} />
          </Box>
        </Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            paddingBlock: "1rem",
          }}
        >
          <Button variant="contained">
            <span
              id="submitBtn"
              dangerouslySetInnerHTML={{ __html: props.submitBtn }}
            />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Button onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained">Share</Button>
      </Box>
    </Box>
  );
};

export default PreviewFormPage;

const formContentContainerStyles: SxProps = {
  display: "grid",
  padding: "2rem",
  placeItems: "center",

  "&, label": {
    color: "#000",
  },
};

const dropContainerStyles: SxProps = {
  bgcolor: "#fff",
  boxShadow: "0px 5px 10px rgba(150,150,150,0.3)",
  marginInline: "auto",
  width: "30vw",
};

const dropAreaStyles: SxProps = {
  borderBlock: "1px solid rgba(204, 204, 204, 0.4)",
  display: "grid",
  paddingInline: "2rem",
  placeItems: "center",
  paddingBlock: "2rem",

  ">div": {
    width: "100%",
    marginBottom: "1rem",
  },

  ".MuiInputBase-root": {
    bgcolor: "rgba(248, 250, 252, 1)",
    border: "1px solid rgba(204, 204, 204, 1)",
    borderRadius: "4px",
  },

  ".MuiFormLabel-root": {
    marginBottom: ".6rem",
  },
};
