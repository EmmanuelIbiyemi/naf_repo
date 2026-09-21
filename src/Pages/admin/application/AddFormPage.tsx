import { Box, SxProps } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";
import FormContentArea from "./components/FormContentArea";
import PropertiesSideBar from "./components/PropertiesSideBar";
import { useEffect, useState } from "react";
import { useGetFormQuery } from "../../../store/api/form.api";
import { useParams } from "react-router-dom";

interface FormData {
  name: string;
  instructions: string;
  sections: any[]; // Replace 'any' with a more specific type if possible
  fee: number;
}

const AddFormPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageName("Application Form"));
  }, [dispatch]);

  const { form_id } = useParams();
  const { data: form } = useGetFormQuery(+(form_id || 0));

  const [formData, setFormData] = useState<FormData>({
    name: form?.data?.name || "",
    instructions: form?.data?.instructions || "",
    sections: form?.data?.sections || [],
    fee: form?.data?.fee || 0,
  });

  useEffect(() => {
    if (form?.data) {
      setFormData({
        name: form.data.name,
        instructions: form.data.instructions,
        sections: form.data.sections || [],
        fee: form.data.fee,
      });
    }
  }, [form]);

  return (
    <Box className="content-container" sx={pageStyles}>
      <PropertiesSideBar
        formData={formData}
        setFormData={setFormData}
      />
      <FormContentArea formData={formData} setFormData={setFormData} />
    </Box>
  );
};

const pageStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "300px 1fr",
};

export default AddFormPage;
