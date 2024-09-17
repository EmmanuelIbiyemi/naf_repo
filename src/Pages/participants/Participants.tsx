import { Box } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FormModal from "../../components/FormModal";
import { useRef, useState } from "react";
import ParticipantForm from "./ParticipantForm";
import ParticipantList from "./ParticipantList";
import {
  CourseCreateType,
  CourseEditFuncType,
  CourseType,
} from "../../types/courses";
import { useAppDispatch } from "../../store/hooks";
import { setPageName } from "../../store/app.slice";
import SuccessModal from "../../components/SuccessModal";
import { blurBg, unBlurBg } from "../../functions/modal";

const ParticipantsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [courseName, setCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const [courses, setCourses] = useState<CourseType[] | []>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Participants"));

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
    blurBg();
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    unBlurBg();
    setSelectedCourse(undefined);
  };

  const handdleAddCourse = (course: CourseCreateType) => {
    setCourses((prev) => [...prev, { id: prev.length + 1, name: course.name }]);
    setCourseName(course.name);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  const handdleEditCourse = (course: CourseType) => {
    setCourses((prev) => {
      const temp = [...prev];
      const foundCourseIndex = courses.findIndex((crs) => crs.id == course.id);
      temp[foundCourseIndex] = { id: course.id, name: course.name };
      return temp;
    });
    handleCloseModal("edit");
    handleOpenModal("success");
  };

  const handleDeleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((crs) => crs.id != id));
  };

  const handleOpenEditModal = (course: CourseType) => {
    setSelectedCourse(course);
    handleOpenModal("edit");
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => handleCloseModal("add")}
      >
        <ParticipantForm
          actions={{
            submit: openModal.add
              ? handdleAddCourse
              : (handdleEditCourse as CourseEditFuncType),
            cancel: () =>
              openModal.add ? handleCloseModal("add") : handleOpenModal("edit"),
          }}
          course={selectedCourse}
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
        close={() => handleCloseModal("success")}
        infoText="The students enrolled in this subject will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new subject to the course <strong>“${courseName}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Participants",
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
        {courses.length ? (
          <ParticipantList
            courses={courses}
            editCourse={handleOpenEditModal}
            deleteCourse={handleDeleteCourse}
          />
        ) : (
          <EmptyState
            title="No Participants at this time"
            subTitle="Participants will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default ParticipantsPage;
