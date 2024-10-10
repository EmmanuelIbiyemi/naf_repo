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
import CoursesItemList from "./CoursesItemList";
import SuccessModal from "../../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
// import FormModal from "../../../../components/FormModal";

interface NoteType {
  id: number;
  name: string;
  created: string;
  modified: string;
}

const Notes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openActionsModal, setOpenActionsModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedNotes, setSelectedNotes] = useState<NoteType | undefined>();

  const handleUploadModalOpen = () => setOpenModal(true);
  const handleUploadModalClose = () => setOpenModal(false);
  const [openFileSuccessModal, setOpenFileSuccessModal] = useState(false);

  const handleDelete = (noteId: number) => {
    console.log(noteId);
    setOpenActionsModal((prev) => ({ ...prev, delete: true }));
  };

  const handleOpenActionsModal = (course: NoteType, type: string) => {
    setSelectedNotes(course);
    setOpenActionsModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseActionsModal = (type: string) => {
    setSelectedNotes(undefined);
    setOpenActionsModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleEditActionsModal = async (note: NoteType) => {
    console.log(note);
    handleCloseActionsModal("edit");
    handleOpenActionsModal(note, "success");
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
          <CoursesItemList
            lists={notes}
            handleOpenActionsModal={handleOpenActionsModal}
            handleEditActionsModal={handleEditActionsModal}
          />
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
          subTitle={`Are you sure you want to delete Course <strong>"${selectedNotes?.name}"</strong>? You can't undo this action.`}
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
            setSelectedNotes(undefined);
          }}
          infoText=""
          open={openActionsModal.success}
          subTitle={`You have successfully added a new Course <strong>"${selectedNotes?.name}"</strong>.`}
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
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 2,
    name: "B.Tech Specialization in Health Informatic",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 3,
    name: "B.Tech Specialization in Health Informats",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 4,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 5,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 6,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 7,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 8,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 9,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 10,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 11,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 12,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 13,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 14,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 15,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 16,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 17,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 18,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 19,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 20,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 21,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
];

export default Notes;
