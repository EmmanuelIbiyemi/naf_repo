import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import InstructorPageHeader from "../../../../components/layout/InstructorPageHeader";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { useFormik } from "formik";
import * as yup from "yup";
// import {
//   useAddCourseMutation,
//   useGetCoursesQuery,
// } from "../../../store/api/courses.api";

import CustomSuccessModal from "../../../../components/CustomSuccessModal";
import NotesUploadModal from "./NotesUploadModal";
import NotesList from "./NotesList";

const Notes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const handleUploadModalOpen = () => setOpenModal(true);
  const handleUploadModalClose = () => setOpenModal(false);
  const [openFileSuccessModal, setOpenFileSuccessModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      subject: "",
      level: "",
      topic: "",
      body: "",
      resources: [],
      fileName: "",
    },
    validationSchema: yup.object({
      subject: yup.string().required("Required"),
      level: yup.string().required("Required"),
      topic: yup.string().required("Required"),
      body: yup.string().required(""),
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
  //     handleCloseModal("add");
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
      {/* <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <NotesForm
          actions={{
            submit: handleAddCourse as CourseFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          course={selectedCourse}
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
          heading="Notes"
          subHeading="List of notes that have been created in the course “Sosososo And So”"
          button={{
            action: () => console.log("Hi"),
            text: "Generate Report",
          }}
          additionalButton={{
            action: handleUploadModalOpen,
            text: "Create New Note",
          }}
        />
        <Box>
          <NotesList />
        </Box>
      </Box>
    </Box>
  );
};

export default Notes;
