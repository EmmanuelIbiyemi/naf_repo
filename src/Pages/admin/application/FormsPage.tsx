import { Box } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import { useNavigate } from "react-router-dom";
import FormList from "./components/FormList";
import {
  useAddFormMutation,
  useAddFormSectionMutation,
  useGetFormsQuery,
} from "../../../store/api/form.api";
import { useEffect, useState } from "react";
import FormModal from "../../../components/FormModal";
import AddForm from "./components/AddForm";

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Application Form"));
  }, [dispatch]);

  const navigate = useNavigate();
  const { data: forms } = useGetFormsQuery(null);
  const [addForm] = useAddFormMutation();
  const [addSection] = useAddFormSectionMutation();
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => setOpenModal(false);

  const action = async (program_id: number) => {
    try {
      const response = await addForm({
        fee: 0,
        name: `Untitled Form ${forms?.data.length || 1}::Submit`,
        program_id,
        sections: [],
      }).unwrap();
      await addSection({
        form_id: response.data.id,
        name: "",
      }).unwrap();

      navigate("/applications/form", { state: response.data.id });
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
          text: "Create",
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
        {forms?.data.length ? (
          <FormList />
        ) : (
          <EmptyState
            title="Oops! There’s nothing here!"
            subTitle="Forms will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default ApplicationPage;
