import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import NotesUploadModal from "../courses/notes/NotesUploadModal";
import CustomSuccessModal from "../../../components/CustomSuccessModal";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import GenerateReportModal from "../courses/cbt/GenerateReportModal";
import CoursesItemList from "../courses/CoursesItemList";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import SuccessModal from "../../../components/SuccessModal";
import { media } from "../../../types/media";
// import {
//   useAddCourseMutation,
//   useGetCoursesQuery,
// } from "../../../store/api/courses.api";

// import { note } from "../../../../types/notes";
// import FormModal from "../../../../components/FormModal";

interface TestType {
  content: string;
  created_at: string;
  id: number;
  media: media;
  title: string;
  updated_at: string;
}

const Reports = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openGenerateReportModal, setOpenGenerateReportModal] = useState(false);
  const [openActionsModal, setOpenActionsModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedTests, setSelectedTests] = useState<TestType | undefined>();

  const handleUploadModalClose = () => setOpenModal(false);
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
    dispatch(setPageName("Reports"));
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log(file);

      // const response = await uploadResource(formData).unwrap();
      // formik.setFieldValue("resources", [
      //   ...formik.values.resources,
      //   ...response.resources.map((resource) => resource.id),
      // ]);
      formik.setFieldValue("fileName", file.name);
      setOpenFileSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
    setOpenModal(false);
    setOpenFileSuccessModal(true);
  };

  const handleProcessFileUrl = (fileUrl: string) => {
    console.log(fileUrl);
  };

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
      <NotesUploadModal
        open={openModal}
        handleClose={handleUploadModalClose}
        handleFileChange={handleFileChange}
        handleProcessFileUrl={handleProcessFileUrl}
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
          heading="Reports"
          subHeading="List of reports that have been generated in the course “Sosososo And So”"
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

export default Reports;
