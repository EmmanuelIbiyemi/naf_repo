import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import FormModal from "../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import {
  CourseCreateType,
  CourseEditFuncType,
  CourseType,
} from "../../../types/courses";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SuccessModal from "../../../components/SuccessModal";
import { useGetCoursesQuery } from "../../../store/api/courses.api";

const CoursesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [courseName, setCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const { data: courses } = useGetCoursesQuery(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Course"));
  }, [dispatch]);

  useEffect(() => {
    console.log(courses?.data);
  }, [courses]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    setSelectedCourse(undefined);
  };

  const handdleAddCourse = (course: CourseCreateType) => {
    setCourseName(course.name);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  const handdleEditCourse = (course: CourseType) => {
    console.log(course);
    handleCloseModal("edit");
    handleOpenModal("success");
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
          handleCloseModal("edit");
        }}
      >
        <CourseForm
          actions={{
            submit: openModal.add
              ? handdleAddCourse
              : (handdleEditCourse as CourseEditFuncType),
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
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
        close={() => {
          handleCloseModal("success");
          setSelectedCourse(undefined);
        }}
        infoText="The students enrolled in this subject will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new subject to the course <strong>“${courseName}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Courses",
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
        {courses?.data.length ? (
          <CourseList />
        ) : (
          <EmptyState
            title="No Courses at this time"
            subTitle="Courses will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default CoursesPage;
