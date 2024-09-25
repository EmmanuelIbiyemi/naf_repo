import { Box } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FormModal from "../../components/FormModal";
import { useState } from "react";
import ParticipantForm from "./ParticipantForm";
import ParticipantList from "./ParticipantList";
import { useAppDispatch } from "../../store/hooks";
import { setPageName } from "../../store/app.slice";
import SuccessModal from "../../components/SuccessModal";
import {
  ParticipantCreateType,
  ParticipantEditFuncType,
  ParticipantType,
} from "../../types/participants";

const ParticipantsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantCreateType>();
  const [participants, setParticipants] = useState<ParticipantType[] | []>([]);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Participants"));

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedParticipant(undefined);
  };

  const handdleAddParticipant = (participant: ParticipantCreateType) => {
    setParticipants((prev) => [
      ...prev,
      { ...participant, id: prev.length + 1 },
    ]);
    setSelectedParticipant(participant);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  const handdleEditCourse = (participant: ParticipantType) => {
    setParticipants((prev) => {
      const temp = [...prev];
      const foundCourseIndex = participants.findIndex(
        (crs) => crs.id == participant.id
      );
      temp[foundCourseIndex] = { ...participant };
      return temp;
    });
    handleCloseModal("edit");
    setSelectedParticipant(participant);
    handleOpenModal("success");
  };

  const handleDeleteParticipant = (id: number) => {
    setParticipants((prev) => prev.filter((crs) => crs.id != id));
  };

  const handleOpenEditModal = (participant: ParticipantType) => {
    setSelectedParticipant(participant);
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
        <ParticipantForm
          actions={{
            submit: openModal.add
              ? handdleAddParticipant
              : (handdleEditCourse as ParticipantEditFuncType),
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
          }}
          participant={selectedParticipant as ParticipantType}
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
        subTitle={`You have successfully added a new subject to the participant <strong>“${selectedParticipant?.first_name} ${selectedParticipant?.last_name}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Participants",
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
        {participants.length ? (
          <ParticipantList
            participants={participants}
            editParticipant={handleOpenEditModal}
            deleteParticipant={handleDeleteParticipant}
            selectedParticipant={selectedParticipant as ParticipantType}
            setSelectedParticipant={setSelectedParticipant}
          />
        ) : (
          <EmptyState
            title="No Participants at this time"
            subTitle="Participants will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default ParticipantsPage;
