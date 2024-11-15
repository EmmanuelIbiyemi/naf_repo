import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import SessionForm from "./SessionForm";
import SessionList from "./SessionList";
import {
  SessionCombinedType,
  SessionCreateType,
  SessionType,
} from "../../../../types/sessions";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddSessionMutation } from "../../../../store/api/sessions.api";
import { FormAction } from "../../../../types/forms";
import { usePromoteAllMutation } from "../../../../store/api/students.api";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";

const SessionsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
    successPromote: false,
    warningPromote: false,
  });
  const [sessionName, setSessionName] = useState("");
  const [selectedSession, setSelectedSession] = useState<SessionType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [addSession] = useAddSessionMutation();
  const [promoteStudents] = usePromoteAllMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Sessions"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedSession(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddSession = async (session: SessionCreateType) => {
    try {
      await addSession(session).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setSessionName(session.name);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePromoteAll = async () => {
    try {
      await promoteStudents(null).unwrap();
      handleOpenModal("successPromote");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <SessionForm
          actions={{
            submit: handleAddSession as FormAction<SessionCombinedType>,
            cancel: () => handleCloseModal("add"),
          }}
          session={selectedSession}
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
        close={() => {
          handleCloseModal("success");
          setSelectedSession(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new session “${sessionName}”.`}
        title="Updates Successful"
      />

      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => {
          handleCloseModal("successPromote");
        }}
        infoText=""
        open={openModal.successPromote}
        subTitle={`You have successfully promoted all students.`}
        title="Updates Successful"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => {
          handlePromoteAll();
          handleCloseModal("warningPromote");
        }}
        infoText="You can't undo this action"
        open={openModal.warningPromote}
        subTitle={`Are you sure you want to promote all students ?`}
        title="Promote all students"
        buttonText="Proceed"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Sessions",
        }}
        secondaryButton={{
          action: () => handleOpenModal("warningPromote"),
          text: "Promote all Students",
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
        <SessionList />
      </Box>
    </Box>
  );
};

export default SessionsPage;
