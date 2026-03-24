import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import StudentForm from "./StudentsForm";
import StudentList from "./StudentsList";
import { StudentType, StudentFormAction, StudentsUploadType } from "../../../../types/students";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddStudentMutation, useUploadStudentsMutation } from "../../../../store/api/students.api";
import StudentsUploadForm from "./StudentsUploadForm";
import StudentPhotoUploadForm from "./StudentPhotoUploadForm";

const StudentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    upload: false,
    photoUpload: false,
    success: false,
  });
  const [studentName, setStudentName] = useState("");
  const [successSubtitle, setSuccessSubtitle] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [addStudent] = useAddStudentMutation();
  const [uploadStudents] = useUploadStudentsMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Users/Students"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddStudent = async (student: StudentType) => {
    try {
      await addStudent(student).unwrap();
      handleCloseModal("add");
      setSuccessSubtitle(
        `You have successfully added a new student "${student.first_name} ${student.last_name}".`
      );
      handleOpenModal("success");
      setStudentName(student.first_name + " " + student.last_name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadStudents = async (data: StudentsUploadType) => {
      try {
        await uploadStudents(data).unwrap();
        handleCloseModal("upload");
        setSuccessSubtitle("Students uploaded successfully.");
        handleOpenModal("success");
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <StudentForm
          actions={{
            submit: handleAddStudent as StudentFormAction,
            cancel: () => handleCloseModal("add"),
          }}
        />
      </FormModal>

      <FormModal open={openModal.upload} close={() => handleCloseModal("upload")}>
          <StudentsUploadForm
            actions={{
              submit: handleUploadStudents,
              cancel: () => handleCloseModal("upload"),
            }}
          />
        </FormModal>

      <FormModal
        open={openModal.photoUpload}
        close={() => handleCloseModal("photoUpload")}
      >
        <StudentPhotoUploadForm close={() => handleCloseModal("photoUpload")} />
      </FormModal>


      <SuccessModal
        close={() => {
          handleCloseModal("success");
        }}
        infoText=""
        open={openModal.success}
        subTitle={successSubtitle || `You have successfully added a new student "${studentName}".`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Students",
        }}
        secondaryButton={{
          action: () => setOpenModal((prev) => ({ ...prev, upload: true })),
          text: "Upload Students",
        }}
        tertiaryButton={{
          action: () =>
            setOpenModal((prev) => ({ ...prev, photoUpload: true })),
          text: "Upload Photos",
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
        <StudentList />
      </Box>
    </Box>
  );
};

export default StudentsPage;
