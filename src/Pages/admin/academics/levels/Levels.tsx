import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddLevelMutation,
  useGetLevelsQuery,
} from "../../../../store/api/levels.api";
import { Level, LevelFormAction } from "../../../../types/levels";
import LevelForm from "./LevelsForm";
import LevelList from "./LevelsList";

const LevelsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [levelName, setLevelName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<Level>();
  const { data: Levels } = useGetLevelsQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addLevel] = useAddLevelMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Academics/Levels"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedLevel(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddLevel = async (level: Level) => {
    try {
      await addLevel(level).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setLevelName(level.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <LevelForm
          actions={{
            submit: handleAddLevel as LevelFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          level={selectedLevel}
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
          setSelectedLevel(undefined);
        }}
        infoText="The instructors added in this level will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new level <strong>“${levelName}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Level",
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
        {Levels?.data.length ? (
          <LevelList />
        ) : (
          <EmptyState
            title="No Levels at this time"
            subTitle="Levels will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default LevelsPage;
