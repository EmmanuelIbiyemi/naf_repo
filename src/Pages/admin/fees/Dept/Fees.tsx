import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import FeeForm from "./FeesForm";
import { Fee, FeeFormAction } from "../../../../types/fees";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddFeeMutation,
  useGetLevelFeesQuery,
} from "../../../../store/api/fees.api";
import FeesList from "./FeesList";
import LevelSelector from "../components/levelSelector";

const FeesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [feeName, setFeeName] = useState("");
  const [selectedFee, setSelectedFee] = useState<Fee>();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { data: fees, refetch: refetchFees } =
    useGetLevelFeesQuery(selectedLevel);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addFee] = useAddFeeMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Fees Management / Department & Level"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedFee(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddFee = async (fee: Fee) => {
    try {
      await addFee(fee).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setFeeName(fee.name);
      refetchFees();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLevelChange = (levelId: string | null) => {
    setSelectedLevel(levelId);
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <FeeForm
          actions={{
            submit: handleAddFee as FeeFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          fee={selectedFee}
        />
      </FormModal>

      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedFee(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new fee "${feeName}".`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Fees",
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
        <LevelSelector value={selectedLevel} onChange={handleLevelChange} />
        {fees?.data && fees.data.length > 0 ? (
          <FeesList level={selectedLevel} />
        ) : (
          <EmptyState
            title="No Fees at this time"
            subTitle="Fees will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default FeesPage;
