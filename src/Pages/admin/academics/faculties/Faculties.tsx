import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddFacultyMutation } from "../../../../store/api/faculties.api";
import { Faculty, FacultyFormAction } from "../../../../types/faculties";
import FacultyForm from "./FacultyForm";
import FacultyList from "./FacultyList";

const SINGLE_FACULTY = import.meta.env.VITE_CUSTOM_SINGLE_FACULTY || "Faculty";
const MULTIPLE_FACULTY = import.meta.env.VITE_CUSTOM_FACULTY || "Faculties";

const FacultiesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [facultyName, setFacultyName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [addFaculty] = useAddFacultyMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName(`Academics/${MULTIPLE_FACULTY}`));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedFaculty(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddFaculty = async (faculty: Faculty) => {
    try {
      await addFaculty(faculty).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setFacultyName(faculty.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <FacultyForm
          actions={{
            submit: handleAddFaculty as FacultyFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          faculty={selectedFaculty}
        />
      </FormModal>

      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedFaculty(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new ${SINGLE_FACULTY} "${facultyName}".`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: `Add ${SINGLE_FACULTY}`,
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
        <FacultyList />
      </Box>
    </Box>
  );
};

export default FacultiesPage;