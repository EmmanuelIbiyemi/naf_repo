import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import EligibleForm from "./EligiblesForm";
import { EligibleCreateType } from "../../../../types/eligibles";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddEligiblesMutation } from "../../../../store/api/eligibles.api";
import EligiblesList from "./EligiblesList";

const EligiblesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [addEligible] = useAddEligiblesMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Eligibles"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddEligible = async (eligible: EligibleCreateType) => {
    try {
      await addEligible(eligible).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <EligibleForm
          actions={{
            submit: handleAddEligible,
            cancel: () => handleCloseModal("add"),
          }}
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
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new list`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Eligibles",
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
        <EligiblesList />
      </Box>
    </Box>
  );
};

export default EligiblesPage;
