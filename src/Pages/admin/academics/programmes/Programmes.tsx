import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddProgrammeMutation } from "../../../../store/api/programmes.api";
import { Programme, ProgrammeFormAction } from "../../../../types/programmes";
import ProgrammeForm from "./ProgrammeForm";
import ProgrammeList from "./ProgrammeList";

const ProgrammesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [programmeName, setProgrammeName] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState<Programme>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [addProgramme] = useAddProgrammeMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Academics/Programmes"));
  }, []);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedProgramme(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddProgramme = async (programme: Programme) => {
    try {
      await addProgramme(programme).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setProgrammeName(programme.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <ProgrammeForm
          actions={{
            submit: handleAddProgramme as ProgrammeFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          programme={selectedProgramme}
        />
      </FormModal>

      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedProgramme(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new programme "${programmeName}".`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Programme",
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
        <ProgrammeList />
      </Box>
    </Box>
  );
};

export default ProgrammesPage;
