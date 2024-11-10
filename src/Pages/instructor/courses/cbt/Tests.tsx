import { Backdrop, Box, CircularProgress, LinearProgress } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import InstructorPageHeader from "../../../../components/layout/InstructorPageHeader";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomSuccessModal from "../../../../components/CustomSuccessModal";
import SuccessModal from "../../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
// import GenerateReportModal from "./GenerateReportModal";
import CreateTestModal from "./stepmodals/CreateTestModal";
import QuizzesItemsList from "../QuizzesItemsList";
import { InstructorQuizzesResponse } from "../../../../types/quizzes";
import {
  useDeleteQuizMutation,
  useGetInstructorCourseQuizzesQuery,
} from "../../../../store/api/quizzes.api";
import {
  useGetCourseQuery,
  // useGetInstructorCoursesQuery,
} from "../../../../store/api/courses.api";
import { useGetCourseParticipantsQuery } from "../../../../store/api/participants.api";

const Tests = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openCreateTestModal, setOpenCreateTestModal] = useState(false);
  // const [openGenerateReportModal, setOpenGenerateReportModal] = useState(false);
  const [openActionsModal, setOpenActionsModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });

  const [selectedTests, setSelectedTests] = useState<
    InstructorQuizzesResponse | undefined
  >();
  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 2];
  const { data: course } = useGetCourseQuery(parseInt(courseId), {
    skip: !courseId,
  });
  const [deleteTest, { isLoading: isDeleting }] = useDeleteQuizMutation();

  const handleOpenCreateTestModal = () => setOpenCreateTestModal(true);
  const handleCloseCreateTestModal = () => setOpenCreateTestModal(false);
  // const handleOpenGenerateReportModal = () => setOpenGenerateReportModal(true);
  // const handleCloseGenerateReportModal = () =>
  //   setOpenGenerateReportModal(false);
  const [openFileSuccessModal, setOpenFileSuccessModal] = useState(false);

  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery({ course_id: parseInt(courseId) });

  const { data: quizzes, isLoading } = useGetInstructorCourseQuizzesQuery(
    { course_id: parseInt(courseId) },
    { skip: !courseId }
  );
  // const { data: courses, isLoading: isGettingCourses } =
  //   useGetInstructorCoursesQuery(null);

  const handleDelete = (testId: number) => {
    try {
      deleteTest(testId).unwrap();
      setOpenActionsModal((prev) => ({ ...prev, delete: true }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenActionsModal = (
    course: InstructorQuizzesResponse,
    type: string
  ) => {
    setSelectedTests(course);
    setOpenActionsModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseActionsModal = (type: string) => {
    setSelectedTests(undefined);
    setOpenActionsModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleEditActionsModal = async (note: InstructorQuizzesResponse) => {
    console.log(note);
    handleCloseActionsModal("edit");
    handleOpenActionsModal(note, "success");
  };

  const formik = useFormik({
    initialValues: {
      subject: "",
      totalQuestions: 0,
      passingPercentage: 0,
      scheduleDate: "",
      expirationDate: "",
      type: "string",
    },
    validationSchema: yup.object({
      subject: yup.string().required("Required"),
      totalQuestions: yup.number().required("Required"),
      passingPercentage: yup.number().required("Required"),
      scheduleDate: yup.string().required("Required"),
      expirationDate: yup.string().required("Required"),
      type: yup.string().required("Required"),
    }),
    onSubmit: async (values: unknown) => {
      try {
        // await createNote(values).unwrap();
        console.log(values);
        // setOpenSuccessModal(true);
        // navigate("");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log("error");
      }
    },
  });

  // const { data: courses } = useGetCoursesQuery(null);
  // const [addCourse] = useAddCourseMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Course"));
  }, [dispatch]);

  // const handleAddCourse = async (course: CourseCreateType2) => {
  //   try {
  //     // await addCourse(course).unwrap();
  //     console.log("Added");
  //     handleCloseActionsModal("add");
  //     handleOpenModal("success");
  //     setCourseName(course.name);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <Box
      ref={containerRef}
      className="content-container"
      component="form"
      onSubmit={formik.handleSubmit}
    >
      {/* <FormModal open={openActionsModal.edit} close={() => handleCloseActionsModal("edit")}>
        <NotesForm
          actions={{
            submit: handleAddCourse as CourseFormAction,
            cancel: () => handleCloseActionsModal("add"),
          }}
          course={selectedTests}
        />
      </FormModal> */}

      <CreateTestModal
        open={openCreateTestModal}
        handleClose={handleCloseCreateTestModal}
        // courses={courses?.data}
        participants={participants?.data ?? []}
      />
      {(isLoading || isFetchingParticipants) && <LinearProgress />}

      <CustomSuccessModal
        message="Your document has been added successfully"
        open={openFileSuccessModal}
        handleClose={() => setOpenFileSuccessModal(false)}
        viewButton={true}
        handleClickView={() => setOpenFileSuccessModal(false)}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <InstructorPageHeader
          heading="CBT"
          subHeading={`List of tests that have been created in the course "${course?.data.name}"`}
          // button={{
          //   action: handleOpenGenerateReportModal,
          //   text: "Generate Report",
          // }}
          additionalButton={{
            action: handleOpenCreateTestModal,
            text: "Create New Test",
            // isLoading: isGettingCourses,
          }}
        />
        {/* <GenerateReportModal
          open={openGenerateReportModal}
          handleClose={handleCloseGenerateReportModal}
        /> */}
        <Box>
          <QuizzesItemsList
            lists={quizzes?.data || []}
            handleOpenActionsModal={handleOpenActionsModal}
            handleEditActionsModal={handleEditActionsModal}
            deleteIcon={true}
          />
        </Box>
        <DeleteConfirmationModal
          actions={{
            proceed: () => {
              if (selectedTests) handleDelete(selectedTests.id);
              console.log("proceed");
            },
            undo: () => {
              console.log("cancel");
            },
          }}
          close={() => handleCloseActionsModal("delete")}
          infoText="The students enrolled in this test will get notified."
          open={openActionsModal.delete}
          subTitle={`Are you sure you want to delete Test "${selectedTests?.name}"? You can't undo this action.`}
          title="Delete Test?"
        />
        <Backdrop open={isDeleting}>
          <CircularProgress />
        </Backdrop>

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
            handleCloseActionsModal("success");
            setSelectedTests(undefined);
          }}
          infoText=""
          open={openActionsModal.success}
          subTitle={`You have successfully added a new Course <strong>"${selectedTests?.name}"</strong>.`}
          title="Updates Successful"
        />
      </Box>
    </Box>
  );
};

export default Tests;
