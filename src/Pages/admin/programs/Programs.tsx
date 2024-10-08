import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import FormModal from "../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import ProgramList from "./ProgramList";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SuccessModal from "../../../components/SuccessModal";
import {
  useAddProgramMutation,
  useGetProgramsQuery,
} from "../../../store/api/programs.api";
import ProgramForm from "./ProgramForm";
import { ProgramCreateType, ProgramType } from "../../../types/programs";
import { FormAction } from "../../../types/forms";
import LoadingScreen from "../../../components/LoadingScreen";

const ProgramPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [programName, setProgramName] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>();
  const { data: programs } = useGetProgramsQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addProgram, addState] = useAddProgramMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Programs"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedProgram(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddProgram = async (program: ProgramCreateType) => {
    try {
      await addProgram(program).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setProgramName(program.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      {addState.isLoading ? (
        <Box sx={{ position: "relative", zIndex: 2000 }}>
          <LoadingScreen />
        </Box>
      ) : null}
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <ProgramForm
          actions={{
            submit: handleAddProgram as FormAction<ProgramType>,
            cancel: () => handleCloseModal("add"),
          }}
          program={selectedProgram}
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
          setSelectedProgram(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new program <strong>“${programName}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Program",
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
        {programs?.data.length ? (
          <ProgramList />
        ) : (
          <EmptyState
            title="No Programs at this time"
            subTitle="Programs will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default ProgramPage;
