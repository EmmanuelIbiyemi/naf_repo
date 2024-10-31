import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader.tsx";
import EmptyState from "../../../../components/EmptyState.tsx";
import FormModal from "../../../../components/FormModal.tsx";
import { useEffect, useRef, useState } from "react";
import ScoreForm from "./ScoresForm.tsx"
import ScoreList from "./ScoresList.tsx";
import {
  Score,
  ScoreFormAction
} from "../../../../types/scores.ts";
import { useAppDispatch } from "../../../../store/hooks.ts";
import { setPageName } from "../../../../store/app.slice.ts";
import SuccessModal from "../../../../components/SuccessModal.tsx";
import {
  useAddScoreMutation,
  useGetScoresQuery,
} from "../../../../store/api/scores.api.ts";

const ScoresPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [scoreName, setScoreName] = useState("");
  const [selectedScore, setSelectedScore] = useState<Score>();
  const { data: scores } = useGetScoresQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addScore] = useAddScoreMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Grading System / Score Categories Setup"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedScore(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddScore = async (score: Score) => {
    try {
      await addScore(score).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setScoreName(`${score.name}`);
    } catch (error) {
      console.log(error); 
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <ScoreForm
          actions={{
            submit: handleAddScore as ScoreFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          score={selectedScore}
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
          setSelectedScore(undefined);
        }}
        infoText="The instructors added in this score will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new score <strong>"${scoreName}"</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Scores",
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
        {scores?.data && scores.data.length > 0 ? (
          <ScoreList />
        ) : (
          <EmptyState
            title="No Scores at this time"
            subTitle="Scores will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default ScoresPage;