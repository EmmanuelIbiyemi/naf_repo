import { Box } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";
import PageHeader from "../../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import FormList from "./components/FormList";
import {
  useAddFormMutation,
  useAddFormSectionMutation,
} from "../../../store/api/form.api";
import { useEffect, useState } from "react";
import FormModal from "../../../components/FormModal";
import AddForm from "./components/AddForm";

type Form = {
  name: string;
  faculty_id: number;
  department_id: number;
  program_id: number;
  level_id: number;
  fee: number;
};

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Application Form"));
  }, [dispatch]);

  const navigate = useNavigate();
  const [addForm] = useAddFormMutation();
  const [addSection] = useAddFormSectionMutation();
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => setOpenModal(false);

  const action = async (form: Form) => {
    try {
      const response = await addForm({
        fee: form.fee,
        name: `${form.name}::Submit`,
        program_id: form.program_id,
        level_id: form.level_id,
        sections: [],
      }).unwrap();
      await addSection({
        form_id: response.data.id,
        name: "",
      }).unwrap();

      navigate(`/form/${response.data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className="content-container">
      <FormModal open={openModal} close={handleCloseModal}>
        <AddForm
          actions={{
            submit: action,
            cancel: handleCloseModal,
          }}
        />
      </FormModal>

      <PageHeader
        button={{
          action: () => setOpenModal(true),
          text: "Add Form",
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <FormList />
      </Box>
    </Box>
  );
};

export default ApplicationPage;
