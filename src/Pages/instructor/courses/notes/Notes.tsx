import { Backdrop, Box, CircularProgress, LinearProgress } from "@mui/material";
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
import CoursesItemList from "../CoursesItemList";
import SuccessModal from "../../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";

import {
  useDeleteNoteMutation,
  useGetCourseNotesQuery,
} from "../../../../store/api/notes.api";
import { note } from "../../../../types/notes";
import CustomPreviewModal from "../../../../components/CustomPreviewModal";
import { useGetCourseQuery } from "../../../../store/api/courses.api";
// import FormModal from "../../../../components/FormModal";
const Notes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openActionsModal, setOpenActionsModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedNotes, setSelectedNotes] = useState<note | undefined>();
  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 2];
  const { data: course } = useGetCourseQuery(parseInt(courseId), {
    skip: !courseId,
  });

  const handleUploadModalOpen = () => setOpenModal(true);
  const handleUploadModalClose = () => setOpenModal(false);
  const [openFileSuccessModal, setOpenFileSuccessModal] = useState(false);

  const { data: note, isLoading: isGettingNotes } = useGetCourseNotesQuery(
    parseInt(courseId)
  );

  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const [openPreviewModals, setOpenPreviewModals] = useState<{
    [key: number]: boolean;
  }>({});

  const handleOpenPreviewModal = (noteId: number) => {
    setOpenPreviewModals((prev) => ({ ...prev, [noteId]: true }));
  };

  const handleClosePreviewModal = (noteId: number) => {
    setOpenPreviewModals((prev) => ({ ...prev, [noteId]: false }));
  };
  const handleDelete = (noteId: number) => {
    try {
      deleteNote(noteId).unwrap();
      setOpenActionsModal((prev) => ({ ...prev, delete: true }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenActionsModal = (course: note, type: string) => {
    setSelectedNotes(course);
    setOpenActionsModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseActionsModal = (type: string) => {
    setSelectedNotes(undefined);
    setOpenActionsModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleEditActionsModal = (note: note) => {
    handleOpenPreviewModal(note.id);
  };

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
      {isGettingNotes && <LinearProgress />}
      {/* <FormModal open={openActionsModal.edit} close={() => handleCloseActionsModal("edit")}>
        <NotesForm
          actions={{
            submit: handleAddCourse as CourseFormAction,
            cancel: () => handleCloseActionsModal("add"),
          }}
          course={selectedNotes}
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
          subHeading={`List of notes that have been created in the course "${course?.data.name}"`}
          // button={{
          //   action: () => console.log("Hi"),
          //   text: "Generate Report",
          // }}
          additionalButton={{
            action: handleUploadModalOpen,
            text: "Create New Note",
          }}
        />
        <Box>
          <CoursesItemList
            lists={note?.data || []}
            handleOpenActionsModal={handleOpenActionsModal}
            handleEditActionsModal={handleEditActionsModal}
            deleteIcon={true}
            edit={true}
          />
          {note?.data.map((singleNote) => (
            <CustomPreviewModal
              key={singleNote.id}
              openModal={openPreviewModals[singleNote.id] || false}
              handleCloseModal={() => handleClosePreviewModal(singleNote.id)}
              note={singleNote}
            />
          ))}
        </Box>
        <DeleteConfirmationModal
          actions={{
            proceed: () => {
              if (selectedNotes) handleDelete(selectedNotes.id);
              console.log("proceed");
            },
            undo: () => {
              console.log("cancel");
            },
          }}
          close={() => handleCloseActionsModal("delete")}
          infoText="The students enrolled in this Course will get notified."
          open={openActionsModal.delete}
          subTitle={`Are you sure you want to delete the note "${selectedNotes?.title}"? You can't undo this action.`}
          title="Delete Note?"
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
            setSelectedNotes(undefined);
          }}
          infoText=""
          open={openActionsModal.success}
          subTitle={`You have successfully added a new Course <strong>"${selectedNotes?.title}"</strong>.`}
          title="Updates Successful"
        />
      </Box>
    </Box>
  );
};

export default Notes;
