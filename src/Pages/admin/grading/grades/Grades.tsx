import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
// import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import GradeForm from "./GradesForm";
import { Grade, GradeFormAction } from "../../../../types/grades";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddGradeMutation } from "../../../../store/api/grades.api";
import GradesList from "./GradesList";

const GradesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [gradeName, setGradeName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<Grade>();
  // const { data: grades, refetch: refetchGrades } = useGetGradesQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addGrade] = useAddGradeMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Grading System / Grading Points"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedGrade(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddGrade = async (grade: Grade) => {
    try {
      await addGrade(grade).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setGradeName(grade.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <GradeForm
          actions={{
            submit: handleAddGrade as GradeFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          grade={selectedGrade}
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
          setSelectedGrade(undefined);
        }}
        infoText="The instructors added in this grade will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new grade <strong>"${gradeName}.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Grades",
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
        <GradesList />
        {/* {grades?.data && grades.data.length > 0 ? (
          <GradesList />
        ) : (
          <EmptyState
            title="No Grades at this time"
            subTitle="Grades will appear here after you add them in your school."
          />
        )} */}
      </Box>
    </Box>
  );
};

export default GradesPage;
