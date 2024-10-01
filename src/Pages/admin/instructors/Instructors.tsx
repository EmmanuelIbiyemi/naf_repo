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
  InstructorCreateType,
  InstructorEditFuncType,
  InstructorType,
} from "../../../types/instructors";

const InstructorsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorCreateType>();
  const [instructors, setInstructors] = useState<InstructorType[] | []>([]);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Instructors"));

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedInstructor(undefined);
  };

  const handdleAddInstructor = (instructor: InstructorCreateType) => {
    setInstructors((prev) => [...prev, { ...instructor, id: prev.length + 1 }]);
    setSelectedInstructor(instructor);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  const handdleEditCourse = (instructor: InstructorType) => {
    setInstructors((prev) => {
      const temp = [...prev];
      const foundCourseIndex = instructors.findIndex(
        (crs) => crs.id == instructor.id
      );
      temp[foundCourseIndex] = { ...instructor };
      return temp;
    });
    handleCloseModal("edit");
    setSelectedInstructor(instructor);
    handleOpenModal("success");
  };

  const handleDeleteInstructor = (id: number) => {
    setInstructors((prev) => prev.filter((crs) => crs.id != id));
  };

  const handleOpenEditModal = (instructor: InstructorType) => {
    setSelectedInstructor(instructor);
    handleOpenModal("edit");
  };

  return (
    <Box className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
          handleCloseModal("edit");
        }}
      >
        <InstructorForm
          actions={{
            submit: openModal.add
              ? handdleAddInstructor
              : (handdleEditCourse as InstructorEditFuncType),
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
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
        infoText="The students enrolled in this subject will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new subject to the instructor <strong>“${selectedInstructor?.first_name} ${selectedInstructor?.last_name}”</strong>.`}
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
        {instructors.length ? (
          <InstructorList
            instructors={instructors}
            editInstructor={handleOpenEditModal}
            deleteInstructor={handleDeleteInstructor}
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
