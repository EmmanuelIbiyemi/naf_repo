import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import FormModal from "../../../components/FormModal";
import { useState } from "react";
import InstructorForm from "./InstructorsForm";
import InstructorList from "./InstructorsList";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SuccessModal from "../../../components/SuccessModal";
import {
  InstructorCombinedType,
  InstructorCreateType,
  InstructorEditFuncType,
  InstructorType,
} from "../../../types/instructors";
import {
  useAddInstructorMutation,
  useGetInstructorsQuery,
} from "../../../store/api/instructors.api";
import LoadingScreen from "../../../components/LoadingScreen";

const InstructorsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorCombinedType>();
  const { data: instructors, isLoading } = useGetInstructorsQuery(null);
  const [addInstructor, addState] = useAddInstructorMutation();

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Instructors"));

  const handleOpenModal = (type: string) => {
    if (type == "add") setSelectedInstructor(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedInstructor(undefined);
  };

  const handleAddInstructor = async (instructor: InstructorCreateType) => {
    try {
      await addInstructor(instructor).unwrap();
    } catch (error) {
      console.log(error);
    }
    setSelectedInstructor(instructor);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  return (
    <Box className="content-container">
      {[isLoading, addState.isLoading].some((item) => item) ? (
        <Box sx={{ position: "relative", zIndex: 2000 }}>
          <LoadingScreen />
        </Box>
      ) : null}

      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
          handleCloseModal("edit");
        }}
      >
        <InstructorForm
          actions={{
            submit: handleAddInstructor as InstructorEditFuncType,
            cancel: () => handleCloseModal("add"),
          }}
          instructor={selectedInstructor as InstructorType}
        />
      </FormModal>

      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => handleCloseModal("success")}
        infoText="The instructor added will get notified via mail."
        open={openModal.success}
        subTitle={`You have successfully added a new instructor to your school.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Instructors",
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
        {instructors?.data.length ? (
          <InstructorList
            selectedInstructor={selectedInstructor as InstructorType}
            setSelectedInstructor={setSelectedInstructor}
          />
        ) : (
          <EmptyState
            title="No Instructors at this time"
            subTitle="Instructors will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default InstructorsPage;
