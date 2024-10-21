import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import InstructorPageHeader from "../../../../components/layout/InstructorPageHeader";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { useFormik } from "formik";
import * as yup from "yup";

import CustomSuccessModal from "../../../../components/CustomSuccessModal";
import CoursesItemList from "../CoursesItemList";
import SuccessModal from "../../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import GenerateReportModal from "./GenerateReportModal";
import { media } from "../../../../types/media";
import CreateTestModal from "./stepmodals/CreateTestModal";

interface TestType {
  content: string;
  created_at: string;
  id: number;
  media: media;
  title: string;
  updated_at: string;
}

const Tests = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openCreateTestModal, setOpenCreateTestModal] = useState(false);
  const [openGenerateReportModal, setOpenGenerateReportModal] = useState(false);
  const [openActionsModal, setOpenActionsModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedTests, setSelectedTests] = useState<TestType | undefined>();

  const handleOpenCreateTestModal = () => setOpenCreateTestModal(true);
  const handleCloseCreateTestModal = () => setOpenCreateTestModal(false);
  const handleOpenGenerateReportModal = () => setOpenGenerateReportModal(true);
  const handleCloseGenerateReportModal = () =>
    setOpenGenerateReportModal(false);
  const [openFileSuccessModal, setOpenFileSuccessModal] = useState(false);

  const handleDelete = (noteId: number) => {
    console.log(noteId);
    setOpenActionsModal((prev) => ({ ...prev, delete: true }));
  };

  const handleOpenActionsModal = (course: TestType, type: string) => {
    setSelectedTests(course);
    setOpenActionsModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseActionsModal = (type: string) => {
    setSelectedTests(undefined);
    setOpenActionsModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleEditActionsModal = async (note: TestType) => {
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
      />

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
          heading="CBT Tests"
          subHeading="List of tests that have been created in the course “Sosososo And So”"
          button={{
            action: handleOpenGenerateReportModal,
            text: "Generate Report",
          }}
          additionalButton={{
            action: handleOpenCreateTestModal,
            text: "Create New Test",
          }}
        />
        <GenerateReportModal
          open={openGenerateReportModal}
          handleClose={handleCloseGenerateReportModal}
        />
        <Box>
          <CoursesItemList
            lists={notes}
            handleOpenActionsModal={handleOpenActionsModal}
            handleEditActionsModal={handleEditActionsModal}
            menu={true}
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
          infoText="The students enrolled in this Course will get notified."
          open={openActionsModal.delete}
          subTitle={`Are you sure you want to delete Course <strong>"${selectedTests?.title}"</strong>? You can't undo this action.`}
          title="Delete Course?"
        />

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
          subTitle={`You have successfully added a new Course <strong>"${selectedTests?.title}"</strong>.`}
          title="Updates Successful"
        />
      </Box>
    </Box>
  );
};

const notes = [
  {
    id: 1,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 2,
    name: "B.Tech Specialization in Health Informatic",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 3,
    name: "B.Tech Specialization in Health Informats",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 4,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 5,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 6,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 7,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 8,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 9,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 10,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 11,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 12,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 13,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 14,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 15,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 16,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 17,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 18,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 19,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 20,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
  {
    id: 21,
    name: "B.Tech Specialization in Health Informatics",
    created_at: "22/09",
    updated_at: "25/09",
    content: "string",
    media: [],
    title: "Title",
  },
];

export default Tests;
