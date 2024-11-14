import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import SemesterForm from "./SemesterForm";
import SemesterList from "./SemesterList";
import {
  SemesterCombinedType,
  SemesterCreateType,
  SemesterType,
} from "../../../../types/semesters";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddSemesterMutation } from "../../../../store/api/semesters.api";
import { FormAction } from "../../../../types/forms";

const SemestersPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
    successPromote: false,
  });
  const [semesterName, setSemesterName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [addSemester] = useAddSemesterMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Semesters"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedSemester(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddSemester = async (semester: SemesterCreateType) => {
    try {
      await addSemester(semester).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setSemesterName(semester.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <SemesterForm
          actions={{
            submit: handleAddSemester as FormAction<SemesterCombinedType>,
            cancel: () => handleCloseModal("add"),
          }}
          semester={selectedSemester}
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
          setSelectedSemester(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new semester “${semesterName}”.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Semesters",
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
        <SemesterList />
      </Box>
    </Box>
  );
};

export default SemestersPage;
