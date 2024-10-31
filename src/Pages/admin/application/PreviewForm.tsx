import { Box, Button, SxProps, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SuccessModal from "../../../components/SuccessModal";
import FormBuilder from "./components/FormBuilder";
import { useAppDispatch } from "../../../store/hooks";
import { addForm } from "../../../store/forms.slice";
import { useGetFormQuery } from "../../../store/api/form.api";
import { setPageName } from "../../../store/app.slice";
import "./components/elements.scss";

const PreviewFormPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Preview Form"));
  }, [dispatch]);

  const navigate = useNavigate();
  const { form_id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const { data: form } = useGetFormQuery(+(form_id || 0));

  const handleSubmit = async () => {
    console.log(form?.data);
    navigate("/applications");
  };

  return (
    <Box sx={formContentContainerStyles}>
      <Box ref={elRef}>
        <SuccessModal
          actions={{
            proceed: () => {
              if (form?.data) dispatch(addForm(form?.data));
              navigate("/applications");
            },
            undo: () => {
              console.log("undo");
            },
          }}
          close={() => setOpenModal(false)}
          infoText="This form will be displayed publicly."
          open={openModal}
          subTitle={`You have successfully added a new form to your school.`}
          title="Updates Successful"
        />
      </Box>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              dangerouslySetInnerHTML={{
                __html: form?.data?.name.split("::")[0] || "",
              }}
            />
          </Typography>
        </Box>
        <Box sx={dropAreaStyles}>
          {form?.data ? (
            <FormBuilder allowDelete={false} isPreview={true} />
          ) : null}
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
              dangerouslySetInnerHTML={{
                __html: form?.data?.name.split("::")[1] || "",
              }}
            />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Button onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Share
        </Button>
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
