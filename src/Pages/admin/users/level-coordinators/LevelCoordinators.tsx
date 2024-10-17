import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddLevelCoordinatorMutation,
  useGetLevelCoordinatorsQuery,
} from "../../../../store/api/levelCoordinators.api";
import { LevelCoordinator, LevelCoordinatorFormAction } from "../../../../types/levelCoordinators";
import LevelCoordinatorForm from "./LevelCoordinatorsForm";
import LevelCoordinatorList from "./LevelCoordinatorsList";

const LevelCoordinatorsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [levelCoordinatorName, setLevelCoordinatorName] = useState("");
  const [selectedLevelCoordinator, setSelectedLevelCoordinator] = useState<LevelCoordinator>();
  const { data: LevelCoordinators } = useGetLevelCoordinatorsQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addLevelCoordinator] = useAddLevelCoordinatorMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Users/Level Coordinators"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedLevelCoordinator(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddLevelCoordinator = async (levelCoordinator: LevelCoordinator) => {
    try {
      await addLevelCoordinator(levelCoordinator).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setLevelCoordinatorName(levelCoordinator.first_name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <LevelCoordinatorForm
          actions={{
            submit: handleAddLevelCoordinator as LevelCoordinatorFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          levelCoordinator={selectedLevelCoordinator}
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
          setSelectedLevelCoordinator(undefined);
        }}
        infoText="The instructors added in this levelCoordinator will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new levelCoordinator <strong>“${levelCoordinatorName}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add LevelCoordinator",
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
        {LevelCoordinators?.data.length ? (
          <LevelCoordinatorList />
        ) : (
          <EmptyState
            title="No LevelCoordinators at this time"
            subTitle="LevelCoordinators will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default LevelCoordinatorsPage;
